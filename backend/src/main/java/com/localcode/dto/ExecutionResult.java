package com.localcode.dto;

/**
 * DTO for code execution result.
 */
public class ExecutionResult {
    private ExecutionStatus status;
    private String output;
    private String errorMessage;
    private ResourceMetrics metrics;
    
    // Constructors
    public ExecutionResult() {
    }
    
    public ExecutionResult(ExecutionStatus status, String output, String errorMessage, ResourceMetrics metrics) {
        this.status = status;
        this.output = output;
        this.errorMessage = errorMessage;
        this.metrics = metrics;
    }
    
    // Getters and Setters
    public ExecutionStatus getStatus() {
        return status;
    }
    
    public void setStatus(ExecutionStatus status) {
        this.status = status;
    }
    
    public String getOutput() {
        return output;
    }
    
    public void setOutput(String output) {
        this.output = output;
    }
    
    public String getErrorMessage() {
        return errorMessage;
    }
    
    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
    
    public ResourceMetrics getMetrics() {
        return metrics;
    }
    
    public void setMetrics(ResourceMetrics metrics) {
        this.metrics = metrics;
    }
}
