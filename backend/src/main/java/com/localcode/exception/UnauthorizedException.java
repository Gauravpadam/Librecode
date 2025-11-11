package com.localcode.exception;

/**
 * Exception thrown when a user attempts to access a resource without proper authorization.
 * This typically results in a 403 HTTP status code.
 */
public class UnauthorizedException extends RuntimeException {
    
    public UnauthorizedException(String message) {
        super(message);
    }
    
    public UnauthorizedException(String message, Throwable cause) {
        super(message, cause);
    }
}
