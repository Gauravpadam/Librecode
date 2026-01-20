package com.localcode.dto;

import java.util.List;

/**
 * DTO for run results (sample test cases only, no submission created).
 */
public class RunResult {
    
    private Long problemId;
    private int totalCount;
    private int passedCount;
    private boolean allPassed;
    private Integer maxRuntimeMs;
    private Integer maxMemoryKb;
    private List<TestResultDTO> testResults;
    
    public RunResult() {
    }
    
    public RunResult(Long problemId, int totalCount, int passedCount, 
                     Integer maxRuntimeMs, Integer maxMemoryKb, 
                     List<TestResultDTO> testResults) {
        this.problemId = problemId;
        this.totalCount = totalCount;
        this.passedCount = passedCount;
        this.allPassed = (passedCount == totalCount);
        this.maxRuntimeMs = maxRuntimeMs;
        this.maxMemoryKb = maxMemoryKb;
        this.testResults = testResults;
    }
    
    public Long getProblemId() {
        return problemId;
    }
    
    public void setProblemId(Long problemId) {
        this.problemId = problemId;
    }
    
    public int getTotalCount() {
        return totalCount;
    }
    
    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }
    
    public int getPassedCount() {
        return passedCount;
    }
    
    public void setPassedCount(int passedCount) {
        this.passedCount = passedCount;
    }
    
    public boolean isAllPassed() {
        return allPassed;
    }
    
    public void setAllPassed(boolean allPassed) {
        this.allPassed = allPassed;
    }
    
    public Integer getMaxRuntimeMs() {
        return maxRuntimeMs;
    }
    
    public void setMaxRuntimeMs(Integer maxRuntimeMs) {
        this.maxRuntimeMs = maxRuntimeMs;
    }
    
    public Integer getMaxMemoryKb() {
        return maxMemoryKb;
    }
    
    public void setMaxMemoryKb(Integer maxMemoryKb) {
        this.maxMemoryKb = maxMemoryKb;
    }
    
    public List<TestResultDTO> getTestResults() {
        return testResults;
    }
    
    public void setTestResults(List<TestResultDTO> testResults) {
        this.testResults = testResults;
    }
}
