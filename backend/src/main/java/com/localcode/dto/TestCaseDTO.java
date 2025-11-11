package com.localcode.dto;

/**
 * DTO for test case representation.
 */
public class TestCaseDTO {
    private Long id;
    private String input;
    private String expectedOutput;
    private Boolean isSample;
    private Integer orderIndex;
    
    // Constructors
    public TestCaseDTO() {
    }
    
    public TestCaseDTO(Long id, String input, String expectedOutput, Boolean isSample, Integer orderIndex) {
        this.id = id;
        this.input = input;
        this.expectedOutput = expectedOutput;
        this.isSample = isSample;
        this.orderIndex = orderIndex;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
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
    
    public Boolean getIsSample() {
        return isSample;
    }
    
    public void setIsSample(Boolean isSample) {
        this.isSample = isSample;
    }
    
    public Integer getOrderIndex() {
        return orderIndex;
    }
    
    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }
}
