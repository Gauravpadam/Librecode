package com.localcode.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO for creating or updating a custom test case.
 */
public class CustomTestCaseRequest {
    
    @NotBlank(message = "Input is required")
    @Size(max = 10240, message = "Input must not exceed 10KB")
    private String input;
    
    @NotBlank(message = "Expected output is required")
    @Size(max = 10240, message = "Expected output must not exceed 10KB")
    private String expectedOutput;
    
    // Constructors
    public CustomTestCaseRequest() {
    }
    
    public CustomTestCaseRequest(String input, String expectedOutput) {
        this.input = input;
        this.expectedOutput = expectedOutput;
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
}
