package com.localcode.persistence.entity;

/**
 * Enum representing the status of a submission.
 */
public enum SubmissionStatus {
    PENDING,
    ACCEPTED,
    WRONG_ANSWER,
    COMPILATION_ERROR,
    RUNTIME_ERROR,
    TIME_LIMIT_EXCEEDED,
    MEMORY_LIMIT_EXCEEDED
}
