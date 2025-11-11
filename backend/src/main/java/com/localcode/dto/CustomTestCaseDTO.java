package com.localcode.dto;

import java.time.LocalDateTime;

/**
 * DTO for custom test case representation.
 */
public class CustomTestCaseDTO {
    private Long id;
    private Long problemId;
    private Long userId;
    private String input;
    private String expectedOutput;
    private LocalDateTime createdAt;
    
    // Constructors
    public CustomTestCaseDTO() {
    }
    
    public CustomTestCaseDTO(Long id, Long problemId, Long userId, String input, String expectedOutput, LocalDateTime createdAt) {
        this.id = id;
        this.problemId = problemId;
        this.userId = userId;
        this.input = input;
        this.expectedOutput = expectedOutput;
        this.createdAt = createdAt;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getProblemId() {
        return problemId;
    }
    
    public void setProblemId(Long problemId) {
        this.problemId = problemId;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getInput() {
        return input;
    }
    
    public void setInput(String input) {
        this.input = input;
    }
    
    public String getExpectedOutput() {
        return expectedOutput;
    }
    
    public void setExpectedOutput(String expectedOutput) {
        this.expectedOutput = expectedOutput;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
