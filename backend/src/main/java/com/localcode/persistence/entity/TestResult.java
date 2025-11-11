package com.localcode.persistence.entity;

import jakarta.persistence.*;

/**
 * Entity representing the result of running a test case against a submission.
 */
@Entity
@Table(name = "test_results")
public class TestResult {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false)
    private Submission submission;
    
    @Column(name = "test_case_id")
    private Long testCaseId;
    
    @Column(nullable = false)
    private Boolean passed;
    
    @Column(name = "actual_output", columnDefinition = "TEXT")
    private String actualOutput;
    
    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;
    
    @Column(name = "runtime_ms")
    private Integer runtimeMs;
    
    @Column(name = "memory_kb")
    private Integer memoryKb;
    
    // Constructors
    public TestResult() {
    }
    
    public TestResult(Submission submission, Long testCaseId, Boolean passed) {
        this.submission = submission;
        this.testCaseId = testCaseId;
        this.passed = passed;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Submission getSubmission() {
        return submission;
    }
    
    public void setSubmission(Submission submission) {
        this.submission = submission;
    }
    
    public Long getTestCaseId() {
        return testCaseId;
    }
    
    public void setTestCaseId(Long testCaseId) {
        this.testCaseId = testCaseId;
    }
    
    public Boolean getPassed() {
        return passed;
    }
    
    public void setPassed(Boolean passed) {
        this.passed = passed;
    }
    
    public String getActualOutput() {
        return actualOutput;
    }
    
    public void setActualOutput(String actualOutput) {
        this.actualOutput = actualOutput;
    }
    
    public String getErrorMessage() {
        return errorMessage;
    }
    
    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
    
    public Integer getRuntimeMs() {
        return runtimeMs;
    }
    
    public void setRuntimeMs(Integer runtimeMs) {
        this.runtimeMs = runtimeMs;
    }
    
    public Integer getMemoryKb() {
        return memoryKb;
    }
    
    public void setMemoryKb(Integer memoryKb) {
        this.memoryKb = memoryKb;
    }
}
