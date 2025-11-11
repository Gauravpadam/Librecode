package com.localcode.controllers;

import com.localcode.dto.*;
import com.localcode.persistence.entity.SubmissionStatus;
import com.localcode.persistence.entity.User;
import com.localcode.services.AuthenticationService;
import com.localcode.services.EvaluationService;
import com.localcode.services.SubmissionService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * REST controller for submission management endpoints.
 */
@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {
    
    private static final Logger logger = LoggerFactory.getLogger(SubmissionController.class);
    
    private final SubmissionService submissionService;
    private final EvaluationService evaluationService;
    private final AuthenticationService authenticationService;
    
    public SubmissionController(SubmissionService submissionService,
                               EvaluationService evaluationService,
                               AuthenticationService authenticationService) {
        this.submissionService = submissionService;
        this.evaluationService = evaluationService;
        this.authenticationService = authenticationService;
    }
    
    /**
     * Submit a solution for evaluation.
     * Creates a submission and triggers asynchronous evaluation.
     *
     * @param request the submission request
     * @return ResponseEntity with submission DTO
     */
    @PostMapping
    public ResponseEntity<?> submitSolution(@Valid @RequestBody SubmissionRequest request) {
        try {
            User currentUser = getCurrentUser();
            
            // Create submission
            SubmissionDTO submission = submissionService.createSubmission(request, currentUser.getId());
            
            // Trigger evaluation asynchronously
            CompletableFuture.runAsync(() -> {
                try {
                    evaluationService.evaluate(submission.getId());
                } catch (Exception e) {
                    logger.error("Error evaluating submission: {}", submission.getId(), e);
                }
            });
            
            logger.info("Submission created and evaluation triggered: {}", submission.getId());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(submission);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Error creating submission", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to create submission: " + e.getMessage()));
        }
    }
    
    /**
     * Get user submission history with optional status filtering.
     *
     * @param status optional status filter (ACCEPTED, WRONG_ANSWER, TLE, MLE, etc.)
     * @return ResponseEntity with list of submission DTOs
     */
    @GetMapping
    public ResponseEntity<?> getUserSubmissions(@RequestParam(required = false) String status) {
        try {
            User currentUser = getCurrentUser();
            
            SubmissionStatus statusEnum = null;
            if (status != null && !status.isEmpty()) {
                try {
                    statusEnum = SubmissionStatus.valueOf(status.toUpperCase());
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(new ErrorResponse("Invalid status: " + status));
                }
            }
            
            List<SubmissionDTO> submissions = submissionService.getUserSubmissions(
                currentUser.getId(), 
                statusEnum
            );
            
            return ResponseEntity.ok(submissions);
            
        } catch (Exception e) {
            logger.error("Error fetching user submissions", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to fetch submissions: " + e.getMessage()));
        }
    }
    
    /**
     * Get detailed submission information by ID.
     *
     * @param id the submission ID
     * @return ResponseEntity with submission detail DTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getSubmissionById(@PathVariable Long id) {
        try {
            User currentUser = getCurrentUser();
            
            SubmissionDetailDTO submission = submissionService.getSubmissionById(id, currentUser.getId());
            
            return ResponseEntity.ok(submission);
            
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("not found") || e.getMessage().contains("access denied")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse(e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Error fetching submission: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to fetch submission: " + e.getMessage()));
        }
    }
    
    /**
     * Get user statistics including solved and attempted problems.
     *
     * @return ResponseEntity with user stats DTO
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getUserStats() {
        try {
            User currentUser = getCurrentUser();
            
            UserStatsDTO stats = submissionService.getUserStats(currentUser.getId());
            
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            logger.error("Error fetching user stats", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to fetch user statistics: " + e.getMessage()));
        }
    }
    
    /**
     * Get the current authenticated user.
     *
     * @return the current user
     * @throws RuntimeException if user is not authenticated
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        
        String username = authentication.getName();
        return authenticationService.getUserByUsername(username);
    }
    
    /**
     * Simple error response class.
     */
    private static class ErrorResponse {
        private final String message;
        
        public ErrorResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() {
            return message;
        }
    }
}
