package com.localcode.dto;

/**
 * DTO for resource usage metrics during code execution.
 */
public class ResourceMetrics {
    private Long runtimeMs;
    private Long memoryKb;
    
    // Constructors
    public ResourceMetrics() {
    }
    
    public ResourceMetrics(Long runtimeMs, Long memoryKb) {
        this.runtimeMs = runtimeMs;
        this.memoryKb = memoryKb;
    }
    
    // Getters and Setters
    public Long getRuntimeMs() {
        return runtimeMs;
    }
    
    public void setRuntimeMs(Long runtimeMs) {
        this.runtimeMs = runtimeMs;
    }
    
    public Long getMemoryKb() {
        return memoryKb;
    }
    
    public void setMemoryKb(Long memoryKb) {
        this.memoryKb = memoryKb;
    }
}
