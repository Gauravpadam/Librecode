package com.localcode.services;

import org.springframework.stereotype.Service;

/**
 * Service for additional validation logic beyond annotation-based validation.
 * Provides centralized validation for code size, test case size, and other business rules.
 */
@Service
public class ValidationService {
    
    // Maximum code size: 50KB (51,200 bytes)
    private static final int MAX_CODE_SIZE_BYTES = 51200;
    
    // Maximum test case input/output size: 10KB (10,240 bytes)
    private static final int MAX_TEST_CASE_SIZE_BYTES = 10240;
    
    /**
     * Validate code size does not exceed maximum limit.
     *
     * @param code the code to validate
     * @throws IllegalArgumentException if code exceeds size limit
     */
    public void validateCodeSize(String code) {
        if (code == null) {
            throw new IllegalArgumentException("Code cannot be null");
        }
        
        int sizeInBytes = code.getBytes().length;
        if (sizeInBytes > MAX_CODE_SIZE_BYTES) {
            throw new IllegalArgumentException(
                String.format("Code size (%d bytes) exceeds maximum allowed size of %d bytes (50KB)", 
                    sizeInBytes, MAX_CODE_SIZE_BYTES)
            );
        }
    }
    
    /**
     * Validate test case input size does not exceed maximum limit.
     *
     * @param input the test case input to validate
     * @throws IllegalArgumentException if input exceeds size limit
     */
    public void validateTestCaseInputSize(String input) {
        if (input == null) {
            throw new IllegalArgumentException("Test case input cannot be null");
        }
        
        int sizeInBytes = input.getBytes().length;
        if (sizeInBytes > MAX_TEST_CASE_SIZE_BYTES) {
            throw new IllegalArgumentException(
                String.format("Test case input size (%d bytes) exceeds maximum allowed size of %d bytes (10KB)", 
                    sizeInBytes, MAX_TEST_CASE_SIZE_BYTES)
            );
        }
    }
    
    /**
     * Validate test case output size does not exceed maximum limit.
     *
     * @param output the test case output to validate
     * @throws IllegalArgumentException if output exceeds size limit
     */
    public void validateTestCaseOutputSize(String output) {
        if (output == null) {
            throw new IllegalArgumentException("Test case output cannot be null");
        }
        
        int sizeInBytes = output.getBytes().length;
        if (sizeInBytes > MAX_TEST_CASE_SIZE_BYTES) {
            throw new IllegalArgumentException(
                String.format("Test case output size (%d bytes) exceeds maximum allowed size of %d bytes (10KB)", 
                    sizeInBytes, MAX_TEST_CASE_SIZE_BYTES)
            );
        }
    }
    
    /**
     * Validate supported programming language.
     *
     * @param language the language to validate
     * @throws IllegalArgumentException if language is not supported
     */
    public void validateLanguage(String language) {
        if (language == null || language.trim().isEmpty()) {
            throw new IllegalArgumentException("Language cannot be null or empty");
        }
        
        String normalizedLanguage = language.toLowerCase();
        if (!normalizedLanguage.equals("java") && 
            !normalizedLanguage.equals("python") && 
            !normalizedLanguage.equals("javascript")) {
            throw new IllegalArgumentException(
                String.format("Unsupported language: %s. Supported languages are: java, python, javascript", 
                    language)
            );
        }
    }
}
