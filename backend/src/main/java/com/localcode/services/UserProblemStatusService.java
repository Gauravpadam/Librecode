package com.localcode.services;

import com.localcode.persistence.entity.Problem;
import com.localcode.persistence.entity.ProblemStatus;
import com.localcode.persistence.entity.User;
import com.localcode.persistence.entity.UserProblemStatus;
import com.localcode.persistence.repository.ProblemRepository;
import com.localcode.persistence.repository.UserProblemStatusRepository;
import com.localcode.persistence.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Service for managing user problem status tracking.
 */
@Service
public class UserProblemStatusService {
    
    private final UserProblemStatusRepository userProblemStatusRepository;
    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    
    public UserProblemStatusService(UserProblemStatusRepository userProblemStatusRepository,
                                   UserRepository userRepository,
                                   ProblemRepository problemRepository) {
        this.userProblemStatusRepository = userProblemStatusRepository;
        this.userRepository = userRepository;
        this.problemRepository = problemRepository;
    }
    
    /**
     * Update or create user problem status.
     *
     * @param userId the user ID
     * @param problemId the problem ID
     * @param status the problem status
     */
    @Transactional
    public void updateStatus(Long userId, Long problemId, ProblemStatus status) {
        Optional<UserProblemStatus> existingStatus = 
            userProblemStatusRepository.findByUserIdAndProblemId(userId, problemId);
        
        if (existingStatus.isPresent()) {
            UserProblemStatus ups = existingStatus.get();
            // Only update if new status is "better" (SOLVED > ATTEMPTED > UNSOLVED)
            if (shouldUpdateStatus(ups.getStatus(), status)) {
                ups.setStatus(status);
                userProblemStatusRepository.save(ups);
            }
        } else {
            // Create new status record
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
            
            UserProblemStatus newStatus = new UserProblemStatus(user, problem, status);
            userProblemStatusRepository.save(newStatus);
        }
    }
    
    /**
     * Get statuses for multiple problems for a user.
     *
     * @param userId the user ID
     * @param problemIds list of problem IDs
     * @return map of problem ID to status
     */
    @Transactional(readOnly = true)
    public Map<Long, ProblemStatus> getStatusesForProblems(Long userId, List<Long> problemIds) {
        Map<Long, ProblemStatus> statusMap = new HashMap<>();
        
        for (Long problemId : problemIds) {
            Optional<UserProblemStatus> status = 
                userProblemStatusRepository.findByUserIdAndProblemId(userId, problemId);
            
            statusMap.put(problemId, status.map(UserProblemStatus::getStatus)
                .orElse(ProblemStatus.UNSOLVED));
        }
        
        return statusMap;
    }
    
    /**
     * Determine if status should be updated based on priority.
     * SOLVED > ATTEMPTED > UNSOLVED
     *
     * @param currentStatus the current status
     * @param newStatus the new status
     * @return true if status should be updated
     */
    private boolean shouldUpdateStatus(ProblemStatus currentStatus, ProblemStatus newStatus) {
        if (currentStatus == ProblemStatus.SOLVED) {
            return false; // Never downgrade from SOLVED
        }
        if (currentStatus == ProblemStatus.ATTEMPTED && newStatus == ProblemStatus.UNSOLVED) {
            return false; // Don't downgrade from ATTEMPTED to UNSOLVED
        }
        return true;
    }
}
