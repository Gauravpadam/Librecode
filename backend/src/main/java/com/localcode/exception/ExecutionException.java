package com.localcode.exception;

/**
 * Exception thrown when code execution fails due to system errors.
 * This is different from compilation or runtime errors in user code.
 * This typically results in a 500 HTTP status code.
 */
public class ExecutionException extends RuntimeException {
    
    private final String executionPhase;
    
    public ExecutionException(String message) {
        super(message);
        this.executionPhase = null;
    }
    
    public ExecutionException(String message, Throwable cause) {
        super(message, cause);
        this.executionPhase = null;
    }
    
    public ExecutionException(String message, String executionPhase) {
        super(message);
        this.executionPhase = executionPhase;
    }
    
    public ExecutionException(String message, String executionPhase, Throwable cause) {
        super(message, cause);
        this.executionPhase = executionPhase;
    }
    
    public String getExecutionPhase() {
        return executionPhase;
    }
}
