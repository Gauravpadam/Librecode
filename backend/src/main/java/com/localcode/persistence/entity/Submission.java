package com.localcode.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing a user's submission for a problem.
 */
@Entity
@Table(name = "submissions", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_problem_id", columnList = "problem_id"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_user_problem", columnList = "user_id, problem_id")
})
public class Submission {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String code;
    
    @Column(nullable = false, length = 20)
    private String language;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private SubmissionStatus status;
    
    @Column(name = "runtime_ms")
    private Integer runtimeMs;
    
    @Column(name = "memory_kb")
    private Integer memoryKb;
    
    @Column(name = "submitted_at", nullable = false, updatable = false)
    private LocalDateTime submittedAt;
    
    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestResult> testResults = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
        if (status == null) {
            status = SubmissionStatus.PENDING;
        }
    }
    
    // Constructors
    public Submission() {
    }
    
    public Submission(User user, Problem problem, String code, String language) {
        this.user = user;
        this.problem = problem;
        this.code = code;
        this.language = language;
        this.status = SubmissionStatus.PENDING;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Problem getProblem() {
        return problem;
    }
    
    public void setProblem(Problem problem) {
        this.problem = problem;
    }
    
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
    
    public SubmissionStatus getStatus() {
        return status;
    }
    
    public void setStatus(SubmissionStatus status) {
        this.status = status;
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
    
    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }
    
    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
    
    public List<TestResult> getTestResults() {
        return testResults;
    }
    
    public void setTestResults(List<TestResult> testResults) {
        this.testResults = testResults;
    }
}
