package com.localcode.persistence.repository;

import com.localcode.persistence.entity.Submission;
import com.localcode.persistence.entity.SubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Submission entity operations.
 */
@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    
    /**
     * Find all submissions for a specific user, ordered by submission date descending.
     *
     * @param userId the user ID
     * @return list of submissions for the user
     */
    List<Submission> findByUserIdOrderBySubmittedAtDesc(Long userId);
    
    /**
     * Find all submissions for a specific user and problem.
     *
     * @param userId the user ID
     * @param problemId the problem ID
     * @return list of submissions for the user and problem
     */
    List<Submission> findByUserIdAndProblemIdOrderBySubmittedAtDesc(Long userId, Long problemId);
    
    /**
     * Find all submissions for a specific user with a specific status.
     *
     * @param userId the user ID
     * @param status the submission status
     * @return list of submissions for the user with the specified status
     */
    List<Submission> findByUserIdAndStatusOrderBySubmittedAtDesc(Long userId, SubmissionStatus status);
    
    /**
     * Find a submission by ID and user ID (for authorization).
     *
     * @param id the submission ID
     * @param userId the user ID
     * @return Optional containing the submission if found and owned by user
     */
    Optional<Submission> findByIdAndUserId(Long id, Long userId);
    
    /**
     * Count total submissions for a specific user.
     *
     * @param userId the user ID
     * @return count of submissions for the user
     */
    long countByUserId(Long userId);
    
    /**
     * Count submissions for a specific user and status.
     *
     * @param userId the user ID
     * @param status the submission status
     * @return count of submissions for the user with the specified status
     */
    long countByUserIdAndStatus(Long userId, SubmissionStatus status);
    
    /**
     * Find distinct problem IDs that a user has submitted for with ACCEPTED status.
     *
     * @param userId the user ID
     * @return list of problem IDs the user has solved
     */
    @Query("SELECT DISTINCT s.problem.id FROM Submission s WHERE s.user.id = :userId AND s.status = 'ACCEPTED'")
    List<Long> findSolvedProblemIdsByUserId(@Param("userId") Long userId);
    
    /**
     * Find distinct problem IDs that a user has attempted (any submission).
     *
     * @param userId the user ID
     * @return list of problem IDs the user has attempted
     */
    @Query("SELECT DISTINCT s.problem.id FROM Submission s WHERE s.user.id = :userId")
    List<Long> findAttemptedProblemIdsByUserId(@Param("userId") Long userId);
    
    /**
     * Check if a user has an accepted submission for a specific problem.
     *
     * @param userId the user ID
     * @param problemId the problem ID
     * @return true if user has solved the problem, false otherwise
     */
    boolean existsByUserIdAndProblemIdAndStatus(Long userId, Long problemId, SubmissionStatus status);
    
    /**
     * Get the best (fastest) accepted submission for a user and problem.
     *
     * @param userId the user ID
     * @param problemId the problem ID
     * @param status the submission status (ACCEPTED)
     * @return Optional containing the fastest accepted submission
     */
    Optional<Submission> findFirstByUserIdAndProblemIdAndStatusOrderByRuntimeMsAsc(
        Long userId, Long problemId, SubmissionStatus status);
    
    /**
     * Find top 10 most recent submissions for a user.
     *
     * @param userId the user ID
     * @return list of top 10 recent submissions
     */
    List<Submission> findTop10ByUserIdOrderBySubmittedAtDesc(Long userId);
}
