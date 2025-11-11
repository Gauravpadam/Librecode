package com.localcode.dto;

import com.localcode.persistence.entity.SubmissionStatus;
import java.util.List;

/**
 * DTO for evaluation result containing aggregated test results.
 */
public class EvaluationResult {
    
    private Long submissionId;
    private SubmissionStatus status;
    private Integer totalTests;
    private Integer passedTests;
    private Integer runtimeMs;
    private Integer memoryKb;
    private List<TestResultDTO> testResults;
    
    // Constructors
    public EvaluationResult() {
    }
    
    public EvaluationResult(Long submissionId, SubmissionStatus status, Integer totalTests, 
                           Integer passedTests, Integer runtimeMs, Integer memoryKb, 
                           List<TestResultDTO> testResults) {
        this.submissionId = submissionId;
        this.status = status;
        this.totalTests = totalTests;
        this.passedTests = passedTests;
        this.runtimeMs = runtimeMs;
        this.memoryKb = memoryKb;
        this.testResults = testResults;
    }
    
    // Getters and Setters
    public Long getSubmissionId() {
        return submissionId;
    }
    
    public void setSubmissionId(Long submissionId) {
        this.submissionId = submissionId;
    }
    
    public SubmissionStatus getStatus() {
        return status;
    }
    
    public void setStatus(SubmissionStatus status) {
        this.status = status;
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
    
    public List<TestResultDTO> getTestResults() {
        return testResults;
    }
    
    public void setTestResults(List<TestResultDTO> testResults) {
        this.testResults = testResults;
    }
}
