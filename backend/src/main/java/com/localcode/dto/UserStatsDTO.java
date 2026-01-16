package com.localcode.dto;

import java.util.List;

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
    private Double accuracy;
    private List<SubmissionDTO> recentSubmissions;
    
    // Constructors
    public UserStatsDTO() {
    }
    
    public UserStatsDTO(Long userId, Integer totalProblems, Integer solvedProblems, 
                       Integer attemptedProblems, Integer totalSubmissions, 
                       Integer acceptedSubmissions, Double accuracy, 
                       List<SubmissionDTO> recentSubmissions) {
        this.userId = userId;
        this.totalProblems = totalProblems;
        this.solvedProblems = solvedProblems;
        this.attemptedProblems = attemptedProblems;
        this.totalSubmissions = totalSubmissions;
        this.acceptedSubmissions = acceptedSubmissions;
        this.accuracy = accuracy;
        this.recentSubmissions = recentSubmissions;
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
    
    public Double getAccuracy() {
        return accuracy;
    }
    
    public void setAccuracy(Double accuracy) {
        this.accuracy = accuracy;
    }
    
    public List<SubmissionDTO> getRecentSubmissions() {
        return recentSubmissions;
    }
    
    public void setRecentSubmissions(List<SubmissionDTO> recentSubmissions) {
        this.recentSubmissions = recentSubmissions;
    }
}
