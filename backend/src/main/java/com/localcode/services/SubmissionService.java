package com.localcode.services;

import com.localcode.dto.*;
import com.localcode.exception.ResourceNotFoundException;
import com.localcode.exception.UnauthorizedException;
import com.localcode.persistence.entity.*;
import com.localcode.persistence.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

/**
 * Service for managing submissions.
 */
@Service
public class SubmissionService {
    
    private static final Logger logger = LoggerFactory.getLogger(SubmissionService.class);
    
    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final TestResultRepository testResultRepository;
    private final UserProblemStatusService userProblemStatusService;
    
    public SubmissionService(SubmissionRepository submissionRepository,
                           ProblemRepository problemRepository,
                           UserRepository userRepository,
                           TestResultRepository testResultRepository,
                           UserProblemStatusService userProblemStatusService) {
        this.submissionRepository = submissionRepository;
        this.problemRepository = problemRepository;
        this.userRepository = userRepository;
        this.testResultRepository = testResultRepository;
        this.userProblemStatusService = userProblemStatusService;
    }
    
    /**
     * Create a new submission for a user.
     *
     * @param request the submission request
     * @param userId the user ID
     * @return the created submission DTO
     */
    @Transactional
    public SubmissionDTO createSubmission(SubmissionRequest request, Long userId) {
        logger.info("Creating submission for user {} and problem {}", userId, request.getProblemId());
        
        // Validate user exists
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        // Validate problem exists
        Problem problem = problemRepository.findById(request.getProblemId())
            .orElseThrow(() -> new ResourceNotFoundException("Problem", "id", request.getProblemId()));
        
        // Create submission entity
        Submission submission = new Submission(user, problem, request.getCode(), request.getLanguage());
        submission.setStatus(SubmissionStatus.PENDING);
        
        // Save submission
        submission = submissionRepository.save(submission);
        
        logger.info("Created submission with ID: {}", submission.getId());
        
        return convertToDTO(submission);
    }
    
    /**
     * Get all submissions for a user with optional status filtering.
     *
     * @param userId the user ID
     * @param status optional status filter
     * @return list of submission DTOs
     */
    @Transactional(readOnly = true)
    public List<SubmissionDTO> getUserSubmissions(Long userId, SubmissionStatus status) {
        logger.info("Fetching submissions for user {} with status filter: {}", userId, status);
        
        List<Submission> submissions;
        
        if (status != null) {
            submissions = submissionRepository.findByUserIdAndStatusOrderBySubmittedAtDesc(userId, status);
        } else {
            submissions = submissionRepository.findByUserIdOrderBySubmittedAtDesc(userId);
        }
        
        return submissions.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get submission by ID with authorization check.
     *
     * @param submissionId the submission ID
     * @param userId the user ID
     * @return the submission detail DTO
     */
    @Transactional(readOnly = true)
    public SubmissionDetailDTO getSubmissionById(Long submissionId, Long userId) {
        logger.info("Fetching submission {} for user {}", submissionId, userId);
        
        // Find submission and verify ownership
        Submission submission = submissionRepository.findByIdAndUserId(submissionId, userId)
            .orElseThrow(() -> new UnauthorizedException(
                "Submission not found or access denied: " + submissionId));
        
        // Get test results
        List<TestResult> testResults = testResultRepository.findBySubmissionId(submissionId);
        
        return convertToDetailDTO(submission, testResults);
    }
    
    /**
     * Get user statistics including solved and attempted problems.
     *
     * @param userId the user ID
     * @return user statistics DTO
     */
    @Transactional(readOnly = true)
    public UserStatsDTO getUserStats(Long userId) {
        logger.info("Calculating statistics for user {}", userId);
        
        // Get total problems count
        long totalProblems = problemRepository.count();
        
        // Get solved problems (distinct problems with ACCEPTED status)
        List<Long> solvedProblemIds = submissionRepository.findSolvedProblemIdsByUserId(userId);
        int solvedCount = solvedProblemIds.size();
        
        // Get attempted problems (distinct problems with any submission)
        List<Long> attemptedProblemIds = submissionRepository.findAttemptedProblemIdsByUserId(userId);
        int attemptedCount = attemptedProblemIds.size();
        
        // Get total submissions count
        long totalSubmissions = submissionRepository.countByUserId(userId);
        
        // Get accepted submissions count
        long acceptedSubmissions = submissionRepository.countByUserIdAndStatus(userId, SubmissionStatus.ACCEPTED);
        
        // Calculate accuracy
        double accuracy = totalSubmissions > 0 
            ? (acceptedSubmissions * 100.0) / totalSubmissions 
            : 0.0;
        
        // Get recent 10 submissions
        List<Submission> recentSubmissions = submissionRepository.findTop10ByUserIdOrderBySubmittedAtDesc(userId);
        List<SubmissionDTO> recentSubmissionDTOs = recentSubmissions.stream()
            .map(submission -> new SubmissionDTO(
                submission.getId(),
                submission.getProblem().getId(),
                submission.getProblem().getTitle(),
                submission.getLanguage(),
                submission.getStatus(),
                submission.getRuntimeMs(),
                submission.getMemoryKb(),
                submission.getSubmittedAt()
            ))
            .collect(Collectors.toList());
        
        return new UserStatsDTO(
            userId,
            (int) totalProblems,
            solvedCount,
            attemptedCount,
            (int) totalSubmissions,
            (int) acceptedSubmissions,
            accuracy,
            recentSubmissionDTOs
        );
    }
    
    /**
     * Update submission with evaluation results.
     * This method is called by EvaluationService after evaluation is complete.
     *
     * @param submissionId the submission ID
     * @param status the final status
     * @param runtimeMs the maximum runtime
     * @param memoryKb the maximum memory usage
     */
    @Transactional
    public void updateSubmissionResults(Long submissionId, SubmissionStatus status, 
                                       Integer runtimeMs, Integer memoryKb) {
        logger.info("Updating submission {} with status: {}", submissionId, status);
        
        Submission submission = submissionRepository.findById(submissionId)
            .orElseThrow(() -> new ResourceNotFoundException("Submission", "id", submissionId));
        
        submission.setStatus(status);
        submission.setRuntimeMs(runtimeMs);
        submission.setMemoryKb(memoryKb);
        
        submissionRepository.save(submission);
        
        // Update user problem status based on submission result
        Long userId = submission.getUser().getId();
        Long problemId = submission.getProblem().getId();
        
        if (status == SubmissionStatus.ACCEPTED) {
            // Mark as SOLVED if accepted
            userProblemStatusService.updateStatus(userId, problemId, ProblemStatus.SOLVED);
        } else {
            // Mark as ATTEMPTED if not accepted (and not already SOLVED)
            userProblemStatusService.updateStatus(userId, problemId, ProblemStatus.ATTEMPTED);
        }
        
        logger.info("Updated submission {} successfully", submissionId);
    }
    
    /**
     * Convert Submission entity to SubmissionDTO.
     */
    private SubmissionDTO convertToDTO(Submission submission) {
        return new SubmissionDTO(
            submission.getId(),
            submission.getProblem().getId(),
            submission.getProblem().getTitle(),
            submission.getLanguage(),
            submission.getStatus(),
            submission.getRuntimeMs(),
            submission.getMemoryKb(),
            submission.getSubmittedAt()
        );
    }
    
    /**
     * Convert Submission entity to SubmissionDetailDTO with test results.
     */
    private SubmissionDetailDTO convertToDetailDTO(Submission submission, List<TestResult> testResults) {

        // Map of id vs tc for lookups
        Map<Long, TestCase> testCaseMap =
            submission.getProblem().getTestCases()
                .stream()
                .collect(Collectors.toMap(TestCase::getId, tc -> tc));

        List<TestResultDTO> testResultDTOs = testResults.stream()
            .map(this::convertTestResultToDTO)
            .collect(Collectors.toList());

        
        for (TestResultDTO dto : testResultDTOs) {
        // Lookup tc against it's dto's tc id. This ensures each dto is assigned the correct testcase details (order agnostic lookup)
        TestCase tc = testCaseMap.get(dto.getTestCaseId());
        if (tc != null) {
            dto.setInput(tc.getInput());
            dto.setExpectedOutput(tc.getExpectedOutput());
        }
    }

        
        int totalTests = testResults.size();
        int passedTests = (int) testResults.stream().filter(TestResult::getPassed).count();
        
        return new SubmissionDetailDTO(
            submission.getId(),
            submission.getProblem().getId(),
            submission.getProblem().getTitle(),
            submission.getCode(),
            submission.getLanguage(),
            submission.getStatus(),
            submission.getRuntimeMs(),
            submission.getMemoryKb(),
            submission.getSubmittedAt(),
            testResultDTOs,
            totalTests,
            passedTests
        );
    }
    
    /**
     * Convert TestResult entity to TestResultDTO.
     */
    private TestResultDTO convertTestResultToDTO(TestResult testResult) {

        return new TestResultDTO(
            testResult.getId(),
            testResult.getTestCaseId(),
            testResult.getPassed(),
            null,  // Populated
            null,  // Populated
            testResult.getActualOutput(), // This is the one which evalSvc actually populates :/
            testResult.getErrorMessage(),
            testResult.getRuntimeMs(),
            testResult.getMemoryKb(),
            false  // Populated
        );
    }
}
