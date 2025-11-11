package com.localcode.dto;

import com.localcode.persistence.entity.SubmissionStatus;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for detailed submission information including code and test results.
 */
public class SubmissionDetailDTO {
    
    private Long id;
    private Long problemId;
    private String problemTitle;
    private String code;
    private String language;
    private SubmissionStatus status;
    private Integer runtimeMs;
    private Integer memoryKb;
    private LocalDateTime submittedAt;
    private List<TestResultDTO> testResults;
    private Integer totalTests;
    private Integer passedTests;
    
    // Constructors
    public SubmissionDetailDTO() {
    }
    
    public SubmissionDetailDTO(Long id, Long problemId, String problemTitle, String code, 
                              String language, SubmissionStatus status, Integer runtimeMs, 
                              Integer memoryKb, LocalDateTime submittedAt, 
                              List<TestResultDTO> testResults, Integer totalTests, 
                              Integer passedTests) {
        this.id = id;
        this.problemId = problemId;
        this.problemTitle = problemTitle;
        this.code = code;
        this.language = language;
        this.status = status;
        this.runtimeMs = runtimeMs;
        this.memoryKb = memoryKb;
        this.submittedAt = submittedAt;
        this.testResults = testResults;
        this.totalTests = totalTests;
        this.passedTests = passedTests;
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
    
    public List<TestResultDTO> getTestResults() {
        return testResults;
    }
    
    public void setTestResults(List<TestResultDTO> testResults) {
        this.testResults = testResults;
    }
    
    public Integer getTotalTests() {
        return totalTests;
    }
    
    public void setTotalTests(Integer totalTests) {
        this.totalTests = totalTests;
    }
    
    public Integer getPassedTests() {
        return passedTests;
    }
    
    public void setPassedTests(Integer passedTests) {
        this.passedTests = passedTests;
    }
}
