package com.localcode.services;

import com.localcode.dto.CreateProblemRequest;
import com.localcode.dto.ProblemDTO;
import com.localcode.dto.ProblemDetailDTO;
import com.localcode.dto.TestCaseDTO;
import com.localcode.exception.ResourceNotFoundException;
import com.localcode.exception.ValidationException;
import com.localcode.persistence.entity.Difficulty;
import com.localcode.persistence.entity.Problem;
import com.localcode.persistence.entity.SubmissionStatus;
import com.localcode.persistence.entity.TestCase;
import com.localcode.persistence.repository.ProblemRepository;
import com.localcode.persistence.repository.SubmissionRepository;
import com.localcode.persistence.repository.TestCaseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for managing coding problems.
 */
@Service
public class ProblemService {
    
    private final ProblemRepository problemRepository;
    private final SubmissionRepository submissionRepository;
    private final TestCaseRepository testCaseRepository;
    
    public ProblemService(ProblemRepository problemRepository,
                         SubmissionRepository submissionRepository,
                         TestCaseRepository testCaseRepository) {
        this.problemRepository = problemRepository;
        this.submissionRepository = submissionRepository;
        this.testCaseRepository = testCaseRepository;
    }
    
    /**
     * Get all problems with user progress calculation.
     *
     * @param userId the user ID to calculate progress for
     * @return list of problem DTOs with user status
     */
    @Transactional(readOnly = true)
    public List<ProblemDTO> getAllProblems(Long userId) {
        List<Problem> problems = problemRepository.findAllByOrderByCreatedAtDesc();
        
        // Get user's solved and attempted problem IDs
        List<Long> solvedProblemIds = submissionRepository.findSolvedProblemIdsByUserId(userId);
        List<Long> attemptedProblemIds = submissionRepository.findAttemptedProblemIdsByUserId(userId);
        
        Set<Long> solvedSet = new HashSet<>(solvedProblemIds);
        Set<Long> attemptedSet = new HashSet<>(attemptedProblemIds);
        
        return problems.stream()
            .map(problem -> {
                String userStatus = calculateUserStatus(problem.getId(), solvedSet, attemptedSet);
                Integer attemptCount = calculateAttemptCount(problem.getId(), userId);
                
                return new ProblemDTO(
                    problem.getId(),
                    problem.getTitle(),
                    problem.getDifficulty().name(),
                    problem.getTags(),
                    userStatus,
                    attemptCount
                );
            })
            .collect(Collectors.toList());
    }
    
    /**
     * Get problems with filters (difficulty, tags, search).
     *
     * @param userId the user ID to calculate progress for
     * @param difficulty optional difficulty filter
     * @param tags optional tags filter (OR logic)
     * @param searchTerm optional search term for title
     * @return list of problem DTOs with user status
     */
    @Transactional(readOnly = true)
    public List<ProblemDTO> getProblemsWithFilters(Long userId, String difficulty, 
                                                   String[] tags, String searchTerm) {
        List<Problem> problems = problemRepository.findWithFilters(difficulty, tags, searchTerm);
        
        // Get user's solved and attempted problem IDs
        List<Long> solvedProblemIds = submissionRepository.findSolvedProblemIdsByUserId(userId);
        List<Long> attemptedProblemIds = submissionRepository.findAttemptedProblemIdsByUserId(userId);
        
        Set<Long> solvedSet = new HashSet<>(solvedProblemIds);
        Set<Long> attemptedSet = new HashSet<>(attemptedProblemIds);
        
        return problems.stream()
            .map(problem -> {
                String userStatus = calculateUserStatus(problem.getId(), solvedSet, attemptedSet);
                Integer attemptCount = calculateAttemptCount(problem.getId(), userId);
                
                return new ProblemDTO(
                    problem.getId(),
                    problem.getTitle(),
                    problem.getDifficulty().name(),
                    problem.getTags(),
                    userStatus,
                    attemptCount
                );
            })
            .collect(Collectors.toList());
    }
    
    /**
     * Get all problems filtered by difficulty with user progress.
     *
     * @param userId the user ID to calculate progress for
     * @param difficulty the difficulty level to filter by
     * @return list of problem DTOs with user status
     */
    @Transactional(readOnly = true)
    public List<ProblemDTO> getAllProblemsByDifficulty(Long userId, String difficulty) {
        Difficulty difficultyEnum = Difficulty.valueOf(difficulty.toUpperCase());
        List<Problem> problems = problemRepository.findByDifficultyOrderByCreatedAtDesc(difficultyEnum);
        
        List<Long> solvedProblemIds = submissionRepository.findSolvedProblemIdsByUserId(userId);
        List<Long> attemptedProblemIds = submissionRepository.findAttemptedProblemIdsByUserId(userId);
        
        Set<Long> solvedSet = new HashSet<>(solvedProblemIds);
        Set<Long> attemptedSet = new HashSet<>(attemptedProblemIds);
        
        return problems.stream()
            .map(problem -> {
                String userStatus = calculateUserStatus(problem.getId(), solvedSet, attemptedSet);
                Integer attemptCount = calculateAttemptCount(problem.getId(), userId);
                
                return new ProblemDTO(
                    problem.getId(),
                    problem.getTitle(),
                    problem.getDifficulty().name(),
                    problem.getTags(),
                    userStatus,
                    attemptCount
                );
            })
            .collect(Collectors.toList());
    }
    
    /**
     * Get problem by ID with user-specific status.
     *
     * @param problemId the problem ID
     * @param userId the user ID to calculate status for
     * @return problem detail DTO
     * @throws RuntimeException if problem not found
     */
    @Transactional(readOnly = true)
    public ProblemDetailDTO getProblemById(Long problemId, Long userId) {
        Problem problem = problemRepository.findById(problemId)
            .orElseThrow(() -> new ResourceNotFoundException("Problem", "id", problemId));
        
        // Get user's solved and attempted problem IDs
        List<Long> solvedProblemIds = submissionRepository.findSolvedProblemIdsByUserId(userId);
        List<Long> attemptedProblemIds = submissionRepository.findAttemptedProblemIdsByUserId(userId);
        
        Set<Long> solvedSet = new HashSet<>(solvedProblemIds);
        Set<Long> attemptedSet = new HashSet<>(attemptedProblemIds);
        
        String userStatus = calculateUserStatus(problemId, solvedSet, attemptedSet);
        Integer attemptCount = calculateAttemptCount(problemId, userId);
        
        // Build starter code map
        Map<String, String> starterCode = new HashMap<>();
        if (problem.getStarterCodeJava() != null) {
            starterCode.put("java", problem.getStarterCodeJava());
        }
        if (problem.getStarterCodePython() != null) {
            starterCode.put("python", problem.getStarterCodePython());
        }
        if (problem.getStarterCodeJavascript() != null) {
            starterCode.put("javascript", problem.getStarterCodeJavascript());
        }
        
        return new ProblemDetailDTO(
            problem.getId(),
            problem.getTitle(),
            problem.getDescription(),
            problem.getConstraints(),
            problem.getDifficulty().name(),
            problem.getTags(),
            problem.getTimeLimitMs(),
            problem.getMemoryLimitMb(),
            starterCode,
            userStatus,
            attemptCount,
            problem.getCreatedAt()
        );
    }
    
    /**
     * Create a new problem (admin only).
     *
     * @param request the create problem request
     * @return the created problem DTO
     */
    @Transactional
    public ProblemDTO createProblem(CreateProblemRequest request) {
        // Validate difficulty
        Difficulty difficulty;
        try {
            difficulty = Difficulty.valueOf(request.getDifficulty().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ValidationException("difficulty", "Invalid difficulty level: " + request.getDifficulty());
        }
        
        // Create problem entity
        Problem problem = new Problem();
        problem.setTitle(request.getTitle());
        problem.setDescription(request.getDescription());
        problem.setConstraints(request.getConstraints());
        problem.setDifficulty(difficulty);
        problem.setTags(request.getTags());
        problem.setTimeLimitMs(request.getTimeLimitMs());
        problem.setMemoryLimitMb(request.getMemoryLimitMb());
        problem.setStarterCodeJava(request.getStarterCodeJava());
        problem.setStarterCodePython(request.getStarterCodePython());
        problem.setStarterCodeJavascript(request.getStarterCodeJavascript());
        
        // Save problem first to get ID
        problem = problemRepository.save(problem);
        
        // Create test cases if provided
        if (request.getTestCases() != null && !request.getTestCases().isEmpty()) {
            final Problem savedProblem = problem;
            List<TestCase> testCases = request.getTestCases().stream()
                .map(tcRequest -> new TestCase(
                    savedProblem,
                    tcRequest.getInput(),
                    tcRequest.getExpectedOutput(),
                    tcRequest.getIsSample(),
                    tcRequest.getOrderIndex()
                ))
                .collect(Collectors.toList());
            
            testCaseRepository.saveAll(testCases);
        }
        
        return new ProblemDTO(
            problem.getId(),
            problem.getTitle(),
            problem.getDifficulty().name(),
            problem.getTags(),
            "not_attempted",
            0
        );
    }
    
    /**
     * Get test cases for a problem.
     *
     * @param problemId the problem ID
     * @return list of test case DTOs
     */
    @Transactional(readOnly = true)
    public List<TestCaseDTO> getTestCases(Long problemId) {
        // Verify problem exists
        if (!problemRepository.existsById(problemId)) {
            throw new ResourceNotFoundException("Problem", "id", problemId);
        }
        
        List<TestCase> testCases = testCaseRepository.findByProblemIdOrderByOrderIndexAsc(problemId);
        
        return testCases.stream()
            .map(tc -> new TestCaseDTO(
                tc.getId(),
                tc.getInput(),
                tc.getExpectedOutput(),
                tc.getIsSample(),
                tc.getOrderIndex()
            ))
            .collect(Collectors.toList());
    }
    
    /**
     * Calculate user status for a problem.
     *
     * @param problemId the problem ID
     * @param solvedSet set of solved problem IDs
     * @param attemptedSet set of attempted problem IDs
     * @return user status string
     */
    private String calculateUserStatus(Long problemId, Set<Long> solvedSet, Set<Long> attemptedSet) {
        if (solvedSet.contains(problemId)) {
            return "solved";
        } else if (attemptedSet.contains(problemId)) {
            return "attempted";
        } else {
            return "not_attempted";
        }
    }
    
    /**
     * Calculate attempt count for a problem and user.
     *
     * @param problemId the problem ID
     * @param userId the user ID
     * @return number of attempts
     */
    private Integer calculateAttemptCount(Long problemId, Long userId) {
        return (int) submissionRepository.findByUserIdAndProblemIdOrderBySubmittedAtDesc(userId, problemId).size();
    }
}
