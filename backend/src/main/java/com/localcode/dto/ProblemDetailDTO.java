package com.localcode.dto;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * DTO for detailed problem view including all problem information.
 */
public class ProblemDetailDTO {
    private Long id;
    private String title;
    private String description;
    private String constraints;
    private String difficulty;
    private Integer timeLimitMs;
    private Integer memoryLimitMb;
    private Map<String, String> starterCode; // language -> code
    private String userStatus; // "solved", "attempted", "not_attempted"
    private Integer attemptCount;
    private LocalDateTime createdAt;
    
    // Constructors
    public ProblemDetailDTO() {
    }
    
    public ProblemDetailDTO(Long id, String title, String description, String constraints, 
                           String difficulty, Integer timeLimitMs, Integer memoryLimitMb,
                           Map<String, String> starterCode, String userStatus, 
                           Integer attemptCount, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.constraints = constraints;
        this.difficulty = difficulty;
        this.timeLimitMs = timeLimitMs;
        this.memoryLimitMb = memoryLimitMb;
        this.starterCode = starterCode;
        this.userStatus = userStatus;
        this.attemptCount = attemptCount;
        this.createdAt = createdAt;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getConstraints() {
        return constraints;
    }
    
    public void setConstraints(String constraints) {
        this.constraints = constraints;
    }
    
    public String getDifficulty() {
        return difficulty;
    }
    
    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }
    
    public Integer getTimeLimitMs() {
        return timeLimitMs;
    }
    
    public void setTimeLimitMs(Integer timeLimitMs) {
        this.timeLimitMs = timeLimitMs;
    }
    
    public Integer getMemoryLimitMb() {
        return memoryLimitMb;
    }
    
    public void setMemoryLimitMb(Integer memoryLimitMb) {
        this.memoryLimitMb = memoryLimitMb;
    }
    
    public Map<String, String> getStarterCode() {
        return starterCode;
    }
    
    public void setStarterCode(Map<String, String> starterCode) {
        this.starterCode = starterCode;
    }
    
    public String getUserStatus() {
        return userStatus;
    }
    
    public void setUserStatus(String userStatus) {
        this.userStatus = userStatus;
    }
    
    public Integer getAttemptCount() {
        return attemptCount;
    }
    
    public void setAttemptCount(Integer attemptCount) {
        this.attemptCount = attemptCount;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
