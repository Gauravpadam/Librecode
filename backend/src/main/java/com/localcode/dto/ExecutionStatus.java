package com.localcode.dto;

/**
 * Enum representing the status of code execution.
 */
public enum ExecutionStatus {
    SUCCESS,
    COMPILATION_ERROR,
    RUNTIME_ERROR,
    TLE,  // Time Limit Exceeded
    MLE   // Memory Limit Exceeded
}
