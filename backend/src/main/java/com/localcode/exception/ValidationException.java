package com.localcode.exception;

import java.util.HashMap;
import java.util.Map;

/**
 * Exception thrown when input validation fails.
 * This typically results in a 400 HTTP status code.
 */
public class ValidationException extends RuntimeException {
    
    private final Map<String, String> errors;
    
    public ValidationException(String message) {
        super(message);
        this.errors = new HashMap<>();
    }
    
    public ValidationException(String message, Map<String, String> errors) {
        super(message);
        this.errors = errors != null ? errors : new HashMap<>();
    }
    
    public ValidationException(String field, String error) {
        super(String.format("Validation failed for field '%s': %s", field, error));
        this.errors = new HashMap<>();
        this.errors.put(field, error);
    }
    
    public Map<String, String> getErrors() {
        return errors;
    }
}
