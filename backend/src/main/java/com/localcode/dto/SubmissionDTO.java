package com.localcode.dto;

import com.localcode.persistence.entity.SubmissionStatus;
import java.time.LocalDateTime;

/**
 * DTO for submission summary information.
 */
public class SubmissionDTO {
    
    private Long id;
    private Long problemId;
    private String problemTitle;
    private String language;
    private SubmissionStatus status;
    private Integer runtimeMs;
    private Integer memoryKb;
    private LocalDateTime submittedAt;
    
    // Constructors
    public SubmissionDTO() {
    }
    
    public SubmissionDTO(Long id, Long problemId, String problemTitle, String language, 
                        SubmissionStatus status, Integer runtimeMs, Integer memoryKb, 
                        LocalDateTime submittedAt) {
        this.id = id;
        this.problemId = problemId;
        this.problemTitle = problemTitle;
        this.language = language;
        this.status = status;
        this.runtimeMs = runtimeMs;
        this.memoryKb = memoryKb;
        this.submittedAt = submittedAt;
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
    
    public String getProblemTitle() {
        return problemTitle;
    }
    
    public void setProblemTitle(String problemTitle) {
        this.problemTitle = problemTitle;
    }
    
    public String getLanguage() {
        return language;
    }
    
    public void setLanguage(String language) {
        this.language = language;
    }
    
    public SubmissionStatus getStatus() {
        return status;
    }
    
    public void setStatus(SubmissionStatus status) {
        this.status = status;
    }
    
    public Integer getRuntimeMs() {
        return runtimeMs;
    }
    
    public void setRuntimeMs(Integer runtimeMs) {
        this.runtimeMs = runtimeMs;
    }
    
    public Integer getMemoryKb() {
        return memoryKb;
    }
    
    public void setMemoryKb(Integer memoryKb) {
        this.memoryKb = memoryKb;
    }
    
    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }
    
    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
}
