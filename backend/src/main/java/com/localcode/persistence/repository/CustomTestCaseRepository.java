package com.localcode.persistence.repository;

import com.localcode.persistence.entity.CustomTestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for CustomTestCase entity operations.
 */
@Repository
public interface CustomTestCaseRepository extends JpaRepository<CustomTestCase, Long> {
    
    /**
     * Find all custom test cases for a specific problem and user.
     *
     * @param problemId the problem ID
     * @param userId the user ID
     * @return list of custom test cases for the problem and user
     */
    List<CustomTestCase> findByProblemIdAndUserId(Long problemId, Long userId);
    
    /**
     * Find all custom test cases for a specific user.
     *
     * @param userId the user ID
     * @return list of custom test cases for the user
     */
    List<CustomTestCase> findByUserId(Long userId);
    
    /**
     * Find all custom test cases for a specific problem.
     *
     * @param problemId the problem ID
     * @return list of custom test cases for the problem
     */
    List<CustomTestCase> findByProblemId(Long problemId);
    
    /**
     * Find a custom test case by ID and user ID (for ownership validation).
     *
     * @param id the custom test case ID
     * @param userId the user ID
     * @return Optional containing the custom test case if found and owned by user
     */
    Optional<CustomTestCase> findByIdAndUserId(Long id, Long userId);
    
    /**
     * Count custom test cases for a specific problem and user.
     *
     * @param problemId the problem ID
     * @param userId the user ID
     * @return count of custom test cases for the problem and user
     */
    long countByProblemIdAndUserId(Long problemId, Long userId);
    
    /**
     * Delete all custom test cases for a specific problem and user.
     *
     * @param problemId the problem ID
     * @param userId the user ID
     */
    void deleteByProblemIdAndUserId(Long problemId, Long userId);
}
