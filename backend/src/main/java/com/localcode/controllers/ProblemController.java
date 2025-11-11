package com.localcode.controllers;

import com.localcode.dto.CreateProblemRequest;
import com.localcode.dto.ProblemDTO;
import com.localcode.dto.ProblemDetailDTO;
import com.localcode.dto.TestCaseDTO;
import com.localcode.persistence.entity.User;
import com.localcode.services.AuthenticationService;
import com.localcode.services.ProblemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for problem management endpoints.
 */
@RestController
@RequestMapping("/api/problems")
public class ProblemController {
    
    private final ProblemService problemService;
    private final AuthenticationService authenticationService;
    
    public ProblemController(ProblemService problemService, AuthenticationService authenticationService) {
        this.problemService = problemService;
        this.authenticationService = authenticationService;
    }
    
    /**
     * Get all problems with optional difficulty filtering.
     *
     * @param difficulty optional difficulty filter (EASY, MEDIUM, HARD)
     * @return ResponseEntity with list of problem DTOs
     */
    @GetMapping
    public ResponseEntity<?> getAllProblems(@RequestParam(required = false) String difficulty) {
        try {
            User currentUser = getCurrentUser();
            
            List<ProblemDTO> problems;
            if (difficulty != null && !difficulty.isEmpty()) {
                problems = problemService.getAllProblemsByDifficulty(currentUser.getId(), difficulty);
            } else {
                problems = problemService.getAllProblems(currentUser.getId());
            }
            
            return ResponseEntity.ok(problems);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Invalid difficulty level: " + difficulty));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to fetch problems: " + e.getMessage()));
        }
    }
    
    /**
     * Get problem details by ID.
     *
     * @param id the problem ID
     * @return ResponseEntity with problem detail DTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getProblemById(@PathVariable Long id) {
        try {
            User currentUser = getCurrentUser();
            ProblemDetailDTO problem = problemService.getProblemById(id, currentUser.getId());
            return ResponseEntity.ok(problem);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse(e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to fetch problem: " + e.getMessage()));
        }
    }
    
    /**
     * Create a new problem (admin only).
     * Note: This endpoint should be protected with admin role check in production.
     *
     * @param request the create problem request
     * @return ResponseEntity with created problem DTO
     */
    @PostMapping
    public ResponseEntity<?> createProblem(@Valid @RequestBody CreateProblemRequest request) {
        try {
            // TODO: Add admin role check when role-based authorization is implemented
            // For now, any authenticated user can create problems
            
            ProblemDTO problem = problemService.createProblem(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(problem);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Invalid difficulty")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponse(e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to create problem: " + e.getMessage()));
        }
    }
    
    /**
     * Get test cases for a problem.
     *
     * @param id the problem ID
     * @return ResponseEntity with list of test case DTOs
     */
    @GetMapping("/{id}/testcases")
    public ResponseEntity<?> getTestCases(@PathVariable Long id) {
        try {
            List<TestCaseDTO> testCases = problemService.getTestCases(id);
            return ResponseEntity.ok(testCases);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse(e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to fetch test cases: " + e.getMessage()));
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
