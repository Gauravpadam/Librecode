package com.localcode.persistence.repository;

import com.localcode.persistence.entity.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for TestResult entity operations.
 */
@Repository
public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    
    /**
     * Find all test results for a specific submission.
     *
     * @param submissionId the submission ID
     * @return list of test results for the submission
     */
    List<TestResult> findBySubmissionId(Long submissionId);
    
    /**
     * Find all failed test results for a specific submission.
     *
     * @param submissionId the submission ID
     * @param passed whether the test passed (false for failed tests)
     * @return list of failed test results for the submission
     */
    List<TestResult> findBySubmissionIdAndPassed(Long submissionId, Boolean passed);
    
    /**
     * Count total test results for a specific submission.
     *
     * @param submissionId the submission ID
     * @return count of test results for the submission
     */
    long countBySubmissionId(Long submissionId);
    
    /**
     * Count passed test results for a specific submission.
     *
     * @param submissionId the submission ID
     * @param passed whether the test passed (true for passed tests)
     * @return count of passed test results for the submission
     */
    long countBySubmissionIdAndPassed(Long submissionId, Boolean passed);
    
    /**
     * Delete all test results for a specific submission.
     *
     * @param submissionId the submission ID
     */
    void deleteBySubmissionId(Long submissionId);
    
    /**
     * Get the maximum runtime among all test results for a submission.
     *
     * @param submissionId the submission ID
     * @return maximum runtime in milliseconds
     */
    @Query("SELECT MAX(tr.runtimeMs) FROM TestResult tr WHERE tr.submission.id = :submissionId")
    Integer findMaxRuntimeBySubmissionId(@Param("submissionId") Long submissionId);
    
    /**
     * Get the maximum memory usage among all test results for a submission.
     *
     * @param submissionId the submission ID
     * @return maximum memory usage in kilobytes
     */
    @Query("SELECT MAX(tr.memoryKb) FROM TestResult tr WHERE tr.submission.id = :submissionId")
    Integer findMaxMemoryBySubmissionId(@Param("submissionId") Long submissionId);
}
