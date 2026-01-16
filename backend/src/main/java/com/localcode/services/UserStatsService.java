package com.localcode.services;

import com.localcode.dto.SubmissionDTO;
import com.localcode.dto.UserStatsDTO;
import com.localcode.persistence.entity.Submission;
import com.localcode.persistence.entity.SubmissionStatus;
import com.localcode.persistence.repository.ProblemRepository;
import com.localcode.persistence.repository.SubmissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for calculating and retrieving user statistics.
 */
@Service
public class UserStatsService {
    
    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    
    public UserStatsService(SubmissionRepository submissionRepository,
                           ProblemRepository problemRepository) {
        this.submissionRepository = submissionRepository;
        this.problemRepository = problemRepository;
    }
    
    /**
     * Get comprehensive statistics for a user.
     *
     * @param userId the user ID
     * @return user statistics DTO
     */
    @Transactional(readOnly = true)
    public UserStatsDTO getUserStats(Long userId) {
        // Get total problems count
        long totalProblems = problemRepository.count();
        
        // Get solved problems count (distinct problems with ACCEPTED status)
        List<Long> solvedProblemIds = submissionRepository.findSolvedProblemIdsByUserId(userId);
        int solvedProblems = solvedProblemIds.size();
        
        // Get attempted problems count (distinct problems with any submission)
        List<Long> attemptedProblemIds = submissionRepository.findAttemptedProblemIdsByUserId(userId);
        int attemptedProblems = attemptedProblemIds.size();
        
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
            solvedProblems,
            attemptedProblems,
            (int) totalSubmissions,
            (int) acceptedSubmissions,
            accuracy,
            recentSubmissionDTOs
        );
    }
}
