package com.localcode.persistence.entity;

import jakarta.persistence.*;

/**
 * Entity representing a default test case for a problem.
 */
@Entity
@Table(name = "test_cases")
public class TestCase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String input;
    
    @Column(name = "expected_output", columnDefinition = "TEXT", nullable = false)
    private String expectedOutput;
    
    @Column(name = "is_sample", nullable = false)
    private Boolean isSample;
    
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;
    
    // Constructors
    public TestCase() {
    }
    
    public TestCase(Problem problem, String input, String expectedOutput, Boolean isSample, Integer orderIndex) {
        this.problem = problem;
        this.input = input;
        this.expectedOutput = expectedOutput;
        this.isSample = isSample;
        this.orderIndex = orderIndex;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Problem getProblem() {
        return problem;
    }
    
    public void setProblem(Problem problem) {
        this.problem = problem;
    }
    
    public String getInput() {
        return input;
    }
    
    public void setInput(String input) {
        this.input = input;
    }
    
    public String getExpectedOutput() {
        return expectedOutput;
    }
    
    public void setExpectedOutput(String expectedOutput) {
        this.expectedOutput = expectedOutput;
    }
    
    public Boolean getIsSample() {
        return isSample;
    }
    
    public void setIsSample(Boolean isSample) {
        this.isSample = isSample;
    }
    
    public Integer getOrderIndex() {
        return orderIndex;
    }
    
    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }
}
