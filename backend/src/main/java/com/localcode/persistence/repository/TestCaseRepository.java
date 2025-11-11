package com.localcode.persistence.repository;

import com.localcode.persistence.entity.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for TestCase entity operations.
 */
@Repository
public interface TestCaseRepository extends JpaRepository<TestCase, Long> {
    
    /**
     * Find all test cases for a specific problem, ordered by order index.
     *
     * @param problemId the problem ID
     * @return list of test cases for the problem
     */
    List<TestCase> findByProblemIdOrderByOrderIndexAsc(Long problemId);
    
    /**
     * Find all sample test cases for a specific problem.
     *
     * @param problemId the problem ID
     * @param isSample whether to fetch sample test cases
     * @return list of sample test cases for the problem
     */
    List<TestCase> findByProblemIdAndIsSampleOrderByOrderIndexAsc(Long problemId, Boolean isSample);
    
    /**
     * Count test cases for a specific problem.
     *
     * @param problemId the problem ID
     * @return count of test cases for the problem
     */
    long countByProblemId(Long problemId);
    
    /**
     * Delete all test cases for a specific problem.
     *
     * @param problemId the problem ID
     */
    void deleteByProblemId(Long problemId);
}
