package com.localcode.controllers;

import com.localcode.dto.UserStatsDTO;
import com.localcode.persistence.entity.User;
import com.localcode.services.AuthenticationService;
import com.localcode.services.UserStatsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for user-related endpoints.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    
    private final UserStatsService userStatsService;
    private final AuthenticationService authenticationService;
    
    public UserController(UserStatsService userStatsService,
                         AuthenticationService authenticationService) {
        this.userStatsService = userStatsService;
        this.authenticationService = authenticationService;
    }
    
    /**
     * Get statistics for the current user.
     *
     * @return ResponseEntity with user statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<UserStatsDTO> getUserStats() {
        User currentUser = getCurrentUser();
        logger.info("Fetching stats for user: {}", currentUser.getId());
        
        UserStatsDTO stats = userStatsService.getUserStats(currentUser.getId());
        return ResponseEntity.ok(stats);
    }
    
    /**
     * Get the currently authenticated user.
     *
     * @return the current user
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return authenticationService.getUserByUsername(username);
    }
}
