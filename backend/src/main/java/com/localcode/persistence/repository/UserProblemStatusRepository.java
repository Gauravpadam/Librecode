package com.localcode.persistence.repository;

import com.localcode.persistence.entity.ProblemStatus;
import com.localcode.persistence.entity.UserProblemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for UserProblemStatus entity operations.
 */
@Repository
public interface UserProblemStatusRepository extends JpaRepository<UserProblemStatus, Long> {
    
    /**
     * Find user problem status by user ID and problem ID.
     *
     * @param userId the user ID
     * @param problemId the problem ID
     * @return optional containing the user problem status if found
     */
    Optional<UserProblemStatus> findByUserIdAndProblemId(Long userId, Long problemId);
    
    /**
     * Count problems by user ID and status.
     *
     * @param userId the user ID
     * @param status the problem status
     * @return count of problems with the specified status for the user
     */
    long countByUserIdAndStatus(Long userId, ProblemStatus status);
}
