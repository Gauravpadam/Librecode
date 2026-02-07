package com.localcode.services;

import com.localcode.dto.*;
import com.localcode.exception.ResourceNotFoundException;
import com.localcode.exception.ValidationException;
import com.localcode.persistence.entity.*;
import com.localcode.persistence.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Service for evaluating code submissions against test cases.
 */
@Service
public class EvaluationService {
    
    private static final Logger logger = LoggerFactory.getLogger(EvaluationService.class);
    
    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;
    private final CustomTestCaseRepository customTestCaseRepository;
    private final TestResultRepository testResultRepository;
    private final CodeExecutorService codeExecutorService;
    private final SubmissionService submissionService;
    
    public EvaluationService(SubmissionRepository submissionRepository,
                           ProblemRepository problemRepository,
                           TestCaseRepository testCaseRepository,
                           CustomTestCaseRepository customTestCaseRepository,
                           TestResultRepository testResultRepository,
                           CodeExecutorService codeExecutorService,
                           SubmissionService submissionService) {
        this.submissionRepository = submissionRepository;
        this.problemRepository = problemRepository;
        this.testCaseRepository = testCaseRepository;
        this.customTestCaseRepository = customTestCaseRepository;
        this.testResultRepository = testResultRepository;
        this.codeExecutorService = codeExecutorService;
        this.submissionService = submissionService;
    }
    
    /**
     * Evaluate a submission by running it against all test cases.
     *
     * @param submissionId the submission ID
     * @return evaluation result with aggregated test results
     */
    @Transactional
    public EvaluationResult evaluate(Long submissionId) {
        logger.info("Starting evaluation for submission: {}", submissionId);
        
        // Get submission
        Submission submission = submissionRepository.findById(submissionId)
            .orElseThrow(() -> new ResourceNotFoundException("Submission", "id", submissionId));
        
        Problem problem = submission.getProblem();
        User user = submission.getUser();
        
        // Collect all test cases (default + custom)
        List<TestCaseData> allTestCases = collectTestCases(problem.getId(), user.getId());
        
        if (allTestCases.isEmpty()) {
            logger.warn("No test cases found for problem: {}", problem.getId());
            throw new ValidationException("No test cases available for evaluation");
        }
        
        logger.info("Evaluating submission against {} test cases", allTestCases.size());
        
        // Execute code against each test case
        List<TestResultDTO> testResults = new ArrayList<>();
        int passedCount = 0;
        int maxRuntimeMs = 0;
        long maxMemoryKb = 0;
        SubmissionStatus finalStatus = SubmissionStatus.ACCEPTED;

        StringBuilder methodToCall = new StringBuilder();

        // Code smells, I'd need a strategy here to prepare an execution request. For now it's ok.
        switch (submission.getLanguage()) {
            case "java":
                methodToCall.append(problem.getStarterCodeJava());
                break;
            case "python":
                methodToCall.append(problem.getStarterCodePython());
                break;
            case "javascript":
                methodToCall.append(problem.getStarterCodeJavascript());
                break;
            default:
                break;
        }
        
        for (TestCaseData testCase : allTestCases) {
            // Execute code
            ExecutionRequest execRequest = new ExecutionRequest(
                submission.getCode(),
                submission.getLanguage(),
                methodToCall.toString(),
                testCase.input,
                problem.getTimeLimitMs(),
                problem.getMemoryLimitMb()
            );
            
            ExecutionResult execResult = codeExecutorService.runInContainer(execRequest);
            
            // Check for TLE or MLE
            boolean isTLE = checkTimeLimitExceeded(
                execResult.getMetrics().getRuntimeMs(), 
                problem.getTimeLimitMs()
            );
            
            boolean isMLE = checkMemoryLimitExceeded(
                execResult.getMetrics().getMemoryKb(), 
                problem.getMemoryLimitMb()
            );
            
            // Determine if test passed
            boolean passed = false;
            String errorMessage = null;
            
            if (isTLE) {
                finalStatus = SubmissionStatus.TIME_LIMIT_EXCEEDED;
                errorMessage = "Time limit exceeded";
            } else if (isMLE) {
                finalStatus = SubmissionStatus.MEMORY_LIMIT_EXCEEDED;
                errorMessage = "Memory limit exceeded";
            } else if (execResult.getStatus() == ExecutionStatus.COMPILATION_ERROR) {
                finalStatus = SubmissionStatus.COMPILATION_ERROR;
                errorMessage = execResult.getErrorMessage();
            } else if (execResult.getStatus() == ExecutionStatus.RUNTIME_ERROR) {
                finalStatus = SubmissionStatus.RUNTIME_ERROR;
                errorMessage = execResult.getErrorMessage();
            } else if (execResult.getStatus() == ExecutionStatus.SUCCESS) {
                // Compare output
                passed = compareOutput(execResult.getOutput(), testCase.expectedOutput);
                if (!passed && finalStatus == SubmissionStatus.ACCEPTED) {
                    finalStatus = SubmissionStatus.WRONG_ANSWER;
                }
            }
            
            if (passed) {
                passedCount++;
            }
            
            // Track max runtime and memory
            maxRuntimeMs = Math.max(maxRuntimeMs, 
                execResult.getMetrics().getRuntimeMs().intValue());
            maxMemoryKb = Math.max(maxMemoryKb, 
                execResult.getMetrics().getMemoryKb());
            
            // Create and save test result
            TestResult testResult = new TestResult();
            testResult.setSubmission(submission);
            testResult.setTestCaseId(testCase.id);
            testResult.setPassed(passed);
            testResult.setActualOutput(execResult.getOutput());
            testResult.setErrorMessage(errorMessage != null ? errorMessage : execResult.getErrorMessage());
            testResult.setRuntimeMs(execResult.getMetrics().getRuntimeMs().intValue());
            testResult.setMemoryKb(execResult.getMetrics().getMemoryKb().intValue());
            
            testResult = testResultRepository.save(testResult);
            
            // Create DTO
            TestResultDTO resultDTO = new TestResultDTO(
                testResult.getId(),
                testCase.id,
                passed,
                testCase.input,
                testCase.expectedOutput,
                execResult.getOutput(),
                errorMessage != null ? errorMessage : execResult.getErrorMessage(),
                execResult.getMetrics().getRuntimeMs().intValue(),
                execResult.getMetrics().getMemoryKb().intValue(),
                testCase.isCustom
            );
            
            testResults.add(resultDTO);
            
            // Stop evaluation early if compilation or runtime error
            if (finalStatus == SubmissionStatus.COMPILATION_ERROR || 
                finalStatus == SubmissionStatus.RUNTIME_ERROR) {
                logger.info("Stopping evaluation early due to: {}", finalStatus);
                break;
            }
        }
        
        // Update submission with final results
        submissionService.updateSubmissionResults(
            submissionId, 
            finalStatus, 
            maxRuntimeMs, 
            (int) maxMemoryKb
        );
        
        logger.info("Evaluation complete for submission: {} with status: {}", 
            submissionId, finalStatus);
        
        return new EvaluationResult(
            submissionId,
            finalStatus,
            allTestCases.size(),
            passedCount,
            maxRuntimeMs,
            (int) maxMemoryKb,
            testResults
        );
    }
    
    /**
     * Run code against sample test cases only (no submission created).
     * Used for the "Run" button to test code before submitting.
     *
     * @param problemId the problem ID
     * @param code the code to run
     * @param language the programming language
     * @param userId the user ID (for custom test cases)
     * @return run result with test results for sample cases only
     */
    public RunResult runAgainstSampleCases(Long problemId, String code, String language, Long userId) {
        logger.info("Running code against sample test cases for problem: {}", problemId);
        
        // Get problem for limits
        Problem problem = problemRepository.findById(problemId)
            .orElseThrow(() -> new ResourceNotFoundException("Problem", "id", problemId));
        
        // Get only sample test cases
        List<TestCase> sampleTestCases = testCaseRepository.findByProblemIdAndIsSampleOrderByOrderIndexAsc(problemId, true);
        
        if (sampleTestCases.isEmpty()) {
            logger.warn("No sample test cases found for problem: {}", problemId);
            throw new ValidationException("No sample test cases available for this problem");
        }
        
        logger.info("Running against {} sample test cases", sampleTestCases.size());
        
        // Execute code against each sample test case
        List<TestResultDTO> testResults = new ArrayList<>();
        int passedCount = 0;
        int maxRuntimeMs = 0;
        long maxMemoryKb = 0;


        
        for (TestCase testCase : sampleTestCases) {
            // Execute code
            ExecutionRequest execRequest = new ExecutionRequest(
                code,
                language,
                "",
                testCase.getInput(),
                problem.getTimeLimitMs(),
                problem.getMemoryLimitMb()
            );
            
            ExecutionResult execResult = codeExecutorService.runInContainer(execRequest);
            
            // Determine if test passed
            boolean passed = false;
            String errorMessage = null;
            
            if (execResult.getStatus() == ExecutionStatus.COMPILATION_ERROR) {
                errorMessage = execResult.getErrorMessage();
            } else if (execResult.getStatus() == ExecutionStatus.RUNTIME_ERROR) {
                errorMessage = execResult.getErrorMessage();
            } else if (execResult.getStatus() == ExecutionStatus.TLE) {
                errorMessage = "Time limit exceeded";
            } else if (execResult.getStatus() == ExecutionStatus.MLE) {
                errorMessage = "Memory limit exceeded";
            } else if (execResult.getStatus() == ExecutionStatus.SUCCESS) {
                passed = compareOutput(execResult.getOutput(), testCase.getExpectedOutput());
            }
            
            if (passed) {
                passedCount++;
            }
            
            // Track max runtime and memory
            if (execResult.getMetrics() != null) {
                maxRuntimeMs = Math.max(maxRuntimeMs, 
                    execResult.getMetrics().getRuntimeMs() != null ? execResult.getMetrics().getRuntimeMs().intValue() : 0);
                maxMemoryKb = Math.max(maxMemoryKb, 
                    execResult.getMetrics().getMemoryKb() != null ? execResult.getMetrics().getMemoryKb() : 0);
            }
            
            // Create DTO (no ID since not persisted)
            TestResultDTO resultDTO = new TestResultDTO(
                null,  // No ID - not persisted
                testCase.getId(),
                passed,
                testCase.getInput(),
                testCase.getExpectedOutput(),
                execResult.getOutput(),
                errorMessage != null ? errorMessage : execResult.getErrorMessage(),
                execResult.getMetrics() != null ? execResult.getMetrics().getRuntimeMs().intValue() : 0,
                execResult.getMetrics() != null ? execResult.getMetrics().getMemoryKb().intValue() : 0,
                false  // Not custom
            );
            
            testResults.add(resultDTO);
            
            // Stop early if compilation error (no point running other tests)
            if (execResult.getStatus() == ExecutionStatus.COMPILATION_ERROR) {
                logger.info("Stopping run early due to compilation error");
                break;
            }
        }
        
        logger.info("Run complete for problem {}: {}/{} passed", 
            problemId, passedCount, sampleTestCases.size());
       
        // REDUNDANT: TBR
        return new RunResult(
            problemId,
            sampleTestCases.size(),
            passedCount,
            maxRuntimeMs,
            (int) maxMemoryKb,
            testResults
        );
    }
    
    /**
     * Collect all test cases for a problem (default + custom).
     */
    private List<TestCaseData> collectTestCases(Long problemId, Long userId) {
        List<TestCaseData> allTestCases = new ArrayList<>();
        
        // Get default test cases
        List<TestCase> defaultTestCases = testCaseRepository.findByProblemIdOrderByOrderIndexAsc(problemId);
        for (TestCase tc : defaultTestCases) {
            allTestCases.add(new TestCaseData(
                tc.getId(),
                tc.getInput(),
                tc.getExpectedOutput(),
                false
            ));
        }
        
        // Get custom test cases for this user
        List<CustomTestCase> customTestCases = customTestCaseRepository.findByProblemIdAndUserId(problemId, userId);
        for (CustomTestCase ctc : customTestCases) {
            allTestCases.add(new TestCaseData(
                ctc.getId(),
                ctc.getInput(),
                ctc.getExpectedOutput(),
                true
            ));
        }
        
        return allTestCases;
    }
    
    /**
     * Check if execution exceeded time limit.
     */
    private boolean checkTimeLimitExceeded(Long runtimeMs, Integer limitMs) {
        if (runtimeMs == null || limitMs == null) {
            return false;
        }
        return runtimeMs > limitMs;
    }
    
    /**
     * Check if execution exceeded memory limit.
     */
    private boolean checkMemoryLimitExceeded(Long memoryKb, Integer limitMb) {
        if (memoryKb == null || limitMb == null) {
            return false;
        }
        long limitKb = limitMb * 1024L;
        return memoryKb > limitKb;
    }
    
    /**
     * Compare actual output with expected output.
     * Trims whitespace and compares line by line.
     */
    private boolean compareOutput(String actual, String expected) {
        if (actual == null || expected == null) {
            return false;
        }
        
        // Normalize outputs: trim each line and remove trailing empty lines
        String normalizedActual = normalizeOutput(actual);
        String normalizedExpected = normalizeOutput(expected);
        
        return normalizedActual.equals(normalizedExpected);
    }
    
    /**
     * Normalize output by trimming whitespace from each line.
     */
    private String normalizeOutput(String output) {
        if (output == null) {
            return "";
        }
        
        String[] lines = output.split("\n");
        StringBuilder normalized = new StringBuilder();
        
        for (int i = 0; i < lines.length; i++) {
            String trimmed = lines[i].trim();
            if (i == lines.length - 1 && trimmed.isEmpty()) {
                // Skip trailing empty line
                continue;
            }
            normalized.append(trimmed);
            if (i < lines.length - 1) {
                normalized.append("\n");
            }
        }
        
        return normalized.toString().trim();
    }
    
    /**
     * Internal class to hold test case data.
     */
    private static class TestCaseData {
        Long id;
        String input;
        String expectedOutput;
        boolean isCustom;
        
        TestCaseData(Long id, String input, String expectedOutput, boolean isCustom) {
            this.id = id;
            this.input = input;
            this.expectedOutput = expectedOutput;
            this.isCustom = isCustom;
        }
    }
}
