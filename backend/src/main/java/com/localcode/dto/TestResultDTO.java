package com.localcode.dto;

/**
 * DTO for test case execution result.
 */
public class TestResultDTO {
    
    private Long id;
    private Long testCaseId;
    private Boolean passed;
    private String input;
    private String expectedOutput;
    private String actualOutput;
    private String errorMessage;
    private Integer runtimeMs;
    private Integer memoryKb;
    private Boolean isCustom;
    
    // Constructors
    public TestResultDTO() {
    }
    
    public TestResultDTO(Long id, Long testCaseId, Boolean passed, String input, 
                        String expectedOutput, String actualOutput, String errorMessage, 
                        Integer runtimeMs, Integer memoryKb, Boolean isCustom) {
        this.id = id;
        this.testCaseId = testCaseId;
        this.passed = passed;
        this.input = input;
        this.expectedOutput = expectedOutput;
        this.actualOutput = actualOutput;
        this.errorMessage = errorMessage;
        this.runtimeMs = runtimeMs;
        this.memoryKb = memoryKb;
        this.isCustom = isCustom;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getTestCaseId() {
        return testCaseId;
    }
    
    public void setTestCaseId(Long testCaseId) {
        this.testCaseId = testCaseId;
    }
    
    public Boolean getPassed() {
        return passed;
    }
    
    public void setPassed(Boolean passed) {
        this.passed = passed;
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
    
    public String getActualOutput() {
        return actualOutput;
    }
    
    public void setActualOutput(String actualOutput) {
        this.actualOutput = actualOutput;
    }
    
    public String getErrorMessage() {
        return errorMessage;
    }
    
    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
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
    
    public Boolean getIsCustom() {
        return isCustom;
    }
    
    public void setIsCustom(Boolean isCustom) {
        this.isCustom = isCustom;
    }
}
