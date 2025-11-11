package com.localcode.dto;

/**
 * DTO for problem list view with user progress information.
 */
public class ProblemDTO {
    private Long id;
    private String title;
    private String difficulty;
    private String userStatus; // "solved", "attempted", "not_attempted"
    private Integer attemptCount;
    
    // Constructors
    public ProblemDTO() {
    }
    
    public ProblemDTO(Long id, String title, String difficulty, String userStatus, Integer attemptCount) {
        this.id = id;
        this.title = title;
        this.difficulty = difficulty;
        this.userStatus = userStatus;
        this.attemptCount = attemptCount;
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
    
    public String getDifficulty() {
        return difficulty;
    }
    
    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
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
}
