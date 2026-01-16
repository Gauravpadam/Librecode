package com.localcode.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.util.List;

/**
 * DTO for creating a new problem.
 */
public class CreateProblemRequest {
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    private String constraints;
    
    @NotBlank(message = "Difficulty is required")
    private String difficulty; // "EASY", "MEDIUM", "HARD"
    
    @NotNull(message = "Time limit is required")
    @Positive(message = "Time limit must be positive")
    private Integer timeLimitMs;
    
    @NotNull(message = "Memory limit is required")
    @Positive(message = "Memory limit must be positive")
    private Integer memoryLimitMb;
    
    private String starterCodeJava;
    private String starterCodePython;
    private String starterCodeJavascript;
    
    private String[] tags;
    
    private List<TestCaseRequest> testCases;
    
    // Constructors
    public CreateProblemRequest() {
    }
    
    // Getters and Setters
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
    
    public String getStarterCodeJava() {
        return starterCodeJava;
    }
    
    public void setStarterCodeJava(String starterCodeJava) {
        this.starterCodeJava = starterCodeJava;
    }
    
    public String getStarterCodePython() {
        return starterCodePython;
    }
    
    public void setStarterCodePython(String starterCodePython) {
        this.starterCodePython = starterCodePython;
    }
    
    public String getStarterCodeJavascript() {
        return starterCodeJavascript;
    }
    
    public void setStarterCodeJavascript(String starterCodeJavascript) {
        this.starterCodeJavascript = starterCodeJavascript;
    }
    
    public String[] getTags() {
        return tags;
    }
    
    public void setTags(String[] tags) {
        this.tags = tags;
    }
    
    public List<TestCaseRequest> getTestCases() {
        return testCases;
    }
    
    public void setTestCases(List<TestCaseRequest> testCases) {
        this.testCases = testCases;
    }
    
    /**
     * Inner class for test case data in problem creation.
     */
    public static class TestCaseRequest {
        @NotBlank(message = "Test case input is required")
        private String input;
        
        @NotBlank(message = "Test case expected output is required")
        private String expectedOutput;
        
        @NotNull(message = "isSample flag is required")
        private Boolean isSample;
        
        @NotNull(message = "Order index is required")
        private Integer orderIndex;
        
        // Constructors
        public TestCaseRequest() {
        }
        
        // Getters and Setters
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
}
