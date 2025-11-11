package com.localcode.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO for submission request.
 */
public class SubmissionRequest {
    
    @NotNull(message = "Problem ID is required")
    private Long problemId;
    
    @NotBlank(message = "Code cannot be empty")
    @Size(max = 51200, message = "Code size cannot exceed 50KB")
    private String code;
    
    @NotBlank(message = "Language is required")
    private String language;
    
    // Constructors
    public SubmissionRequest() {
    }
    
    public SubmissionRequest(Long problemId, String code, String language) {
        this.problemId = problemId;
        this.code = code;
        this.language = language;
    }
    
    // Getters and Setters
    public Long getProblemId() {
        return problemId;
    }
    
    public void setProblemId(Long problemId) {
        this.problemId = problemId;
    }
    
    public String getCode() {
        return code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }
    
    public String getLanguage() {
        return language;
    }
    
    public void setLanguage(String language) {
        this.language = language;
    }
}
