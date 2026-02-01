package com.localcode.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing a coding problem in the LocalCode system.
 */
@Entity
@Table(name = "problems", indexes = {
    @Index(name = "idx_difficulty", columnList = "difficulty"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
public class Problem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String constraints;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Difficulty difficulty;
    
    @Column(name = "time_limit_ms", nullable = false)
    private Integer timeLimitMs;
    
    @Column(name = "memory_limit_mb", nullable = false)
    private Integer memoryLimitMb;
    
    @Column(name = "starter_code_java", columnDefinition = "TEXT")
    private String starterCodeJava;
    
    @Column(name = "starter_code_python", columnDefinition = "TEXT")
    private String starterCodePython;
    
    @Column(name = "starter_code_javascript", columnDefinition = "TEXT")
    private String starterCodeJavascript;
    
    @Column(name = "tags", columnDefinition = "TEXT[]")
    private String[] tags;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestCase> testCases = new ArrayList<>();
    
    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Submission> submissions = new ArrayList<>();
    
    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CustomTestCase> customTestCases = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Constructors
    public Problem() {
    }
    
    public Problem(String title, String description, Difficulty difficulty, Integer timeLimitMs, Integer memoryLimitMb) {
        this.title = title;
        this.description = description;
        this.difficulty = difficulty;
        this.timeLimitMs = timeLimitMs;
        this.memoryLimitMb = memoryLimitMb;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }


    public void setOutputType(String outputType) {
        this.outputType = outputType;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }


    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getConstraints() {
        return constraints;
    }
    
    public void setConstraints(String constraints) {
        this.constraints = constraints;
    }
    
    public Difficulty getDifficulty() {
        return difficulty;
    }
    
    public void setDifficulty(Difficulty difficulty) {
        this.difficulty = difficulty;
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
    
    public String getStarterCodeJava() {
        return starterCodeJava;
    }
    
    public void setStarterCodeJava(String starterCodeJava) {
        this.starterCodeJava = starterCodeJava;
    }
    
    public String getStarterCodePython() {
        return starterCodePython;
    }
    
    public void setStarterCodePython(String starterCodePython) {
        this.starterCodePython = starterCodePython;
    }
    
    public String getStarterCodeJavascript() {
        return starterCodeJavascript;
    }
    
    public void setStarterCodeJavascript(String starterCodeJavascript) {
        this.starterCodeJavascript = starterCodeJavascript;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public List<TestCase> getTestCases() {
        return testCases;
    }
    
    public void setTestCases(List<TestCase> testCases) {
        this.testCases = testCases;
    }
    
    public List<Submission> getSubmissions() {
        return submissions;
    }
    
    public void setSubmissions(List<Submission> submissions) {
        this.submissions = submissions;
    }
    
    public List<CustomTestCase> getCustomTestCases() {
        return customTestCases;
    }
    
    public void setCustomTestCases(List<CustomTestCase> customTestCases) {
        this.customTestCases = customTestCases;
    }
    
    public String[] getTags() {
        return tags;
    }
    
    public void setTags(String[] tags) {
        this.tags = tags;
    }
}
