package com.localcode.dto;

/**
 * DTO for user statistics and progress tracking.
 */
public class UserStatsDTO {
    
    private Long userId;
    private Integer totalProblems;
    private Integer solvedProblems;
    private Integer attemptedProblems;
    private Integer totalSubmissions;
    private Integer acceptedSubmissions;
    
    // Constructors
    public UserStatsDTO() {
    }
    
    public UserStatsDTO(Long userId, Integer totalProblems, Integer solvedProblems, 
                       Integer attemptedProblems, Integer totalSubmissions, 
                       Integer acceptedSubmissions) {
        this.userId = userId;
        this.totalProblems = totalProblems;
        this.solvedProblems = solvedProblems;
        this.attemptedProblems = attemptedProblems;
        this.totalSubmissions = totalSubmissions;
        this.acceptedSubmissions = acceptedSubmissions;
    }
    
    // Getters and Setters
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public Integer getTotalProblems() {
        return totalProblems;
    }
    
    public void setTotalProblems(Integer totalProblems) {
        this.totalProblems = totalProblems;
    }
    
    public Integer getSolvedProblems() {
        return solvedProblems;
    }
    
    public void setSolvedProblems(Integer solvedProblems) {
        this.solvedProblems = solvedProblems;
    }
    
    public Integer getAttemptedProblems() {
        return attemptedProblems;
    }
    
    public void setAttemptedProblems(Integer attemptedProblems) {
        this.attemptedProblems = attemptedProblems;
    }
    
    public Integer getTotalSubmissions() {
        return totalSubmissions;
    }
    
    public void setTotalSubmissions(Integer totalSubmissions) {
        this.totalSubmissions = totalSubmissions;
    }
    
    public Integer getAcceptedSubmissions() {
        return acceptedSubmissions;
    }
    
    public void setAcceptedSubmissions(Integer acceptedSubmissions) {
        this.acceptedSubmissions = acceptedSubmissions;
    }
}
