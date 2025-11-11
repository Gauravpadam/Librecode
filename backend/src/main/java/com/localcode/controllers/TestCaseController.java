package com.localcode.controllers;

import com.localcode.dto.CustomTestCaseDTO;
import com.localcode.dto.CustomTestCaseRequest;
import com.localcode.persistence.entity.User;
import com.localcode.services.AuthenticationService;
import com.localcode.services.TestCaseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for custom test case management endpoints.
 */
@RestController
@RequestMapping("/api")
public class TestCaseController {
    
    private final TestCaseService testCaseService;
    private final AuthenticationService authenticationService;
    
    public TestCaseController(TestCaseService testCaseService, AuthenticationService authenticationService) {
        this.testCaseService = testCaseService;
        this.authenticationService = authenticationService;
    }
    
    /**
     * Add a custom test case to a problem.
     *
     * @param problemId the problem ID
     * @param request the custom test case request
     * @return ResponseEntity with created custom test case DTO
     */
    @PostMapping("/problems/{problemId}/testcases")
    public ResponseEntity<?> addCustomTestCase(
            @PathVariable Long problemId,
            @Valid @RequestBody CustomTestCaseRequest request) {
        try {
            User currentUser = getCurrentUser();
            CustomTestCaseDTO testCase = testCaseService.addCustomTestCase(problemId, currentUser.getId(), request);
            return ResponseEntity.status(HttpStatus.CREATED).body(testCase);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse(e.getMessage()));
            }
            if (e.getMessage().contains("cannot be empty")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponse(e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to add custom test case: " + e.getMessage()));
        }
    }
    
    /**
     * Get all custom test cases for a problem (user-specific).
     *
     * @param problemId the problem ID
     * @return ResponseEntity with list of custom test case DTOs
     */
    @GetMapping("/problems/{problemId}/testcases/custom")
    public ResponseEntity<?> getCustomTestCases(@PathVariable Long problemId) {
        try {
            User currentUser = getCurrentUser();
            List<CustomTestCaseDTO> testCases = testCaseService.getCustomTestCases(problemId, currentUser.getId());
            return ResponseEntity.ok(testCases);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse(e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to fetch custom test cases: " + e.getMessage()));
        }
    }
    
    /**
     * Update a custom test case.
     *
     * @param id the custom test case ID
     * @param request the update request
     * @return ResponseEntity with updated custom test case DTO
     */
    @PutMapping("/testcases/{id}")
    public ResponseEntity<?> updateCustomTestCase(
            @PathVariable Long id,
            @Valid @RequestBody CustomTestCaseRequest request) {
        try {
            User currentUser = getCurrentUser();
            CustomTestCaseDTO testCase = testCaseService.updateCustomTestCase(id, currentUser.getId(), request);
            return ResponseEntity.ok(testCase);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found") || e.getMessage().contains("don't have permission")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse(e.getMessage()));
            }
            if (e.getMessage().contains("cannot be empty")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponse(e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to update custom test case: " + e.getMessage()));
        }
    }
    
    /**
     * Delete a custom test case.
     *
     * @param id the custom test case ID
     * @return ResponseEntity with no content on success
     */
    @DeleteMapping("/testcases/{id}")
    public ResponseEntity<?> deleteCustomTestCase(@PathVariable Long id) {
        try {
            User currentUser = getCurrentUser();
            testCaseService.deleteCustomTestCase(id, currentUser.getId());
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found") || e.getMessage().contains("don't have permission")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse(e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to delete custom test case: " + e.getMessage()));
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
