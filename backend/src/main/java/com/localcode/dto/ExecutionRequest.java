package com.localcode.dto;

/**
 * DTO for code execution request.
 */
public class ExecutionRequest {
    private String code;
    private String language;
    private String methodToCall;
    private String input;
    private Integer timeLimitMs;
    private Integer memoryLimitMb;
    
    // Constructors
    public ExecutionRequest() {
    }
    
    public ExecutionRequest(String code, String language, String methodToCall, String input, Integer timeLimitMs, Integer memoryLimitMb) {
        this.code = code;
        this.language = language;
        this.methodToCall = methodToCall;
        this.input = input;
        this.timeLimitMs = timeLimitMs;
        this.memoryLimitMb = memoryLimitMb;
    }
    
    // Getters and Setters
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
    
    public String getInput() {
        return input;
    }
    
    public void setInput(String input) {
        this.input = input;
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

    public String getMethodToCall(){
        return this.methodToCall;
    }

    public void setMethodToCall(String methodToCall){
        this.methodToCall = methodToCall;
    }
}
