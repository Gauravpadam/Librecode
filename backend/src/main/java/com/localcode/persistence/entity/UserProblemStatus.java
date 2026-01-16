package com.localcode.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity representing the status of a problem for a specific user.
 */
@Entity
@Table(name = "user_problem_status", 
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_problem", columnNames = {"user_id", "problem_id"})
    },
    indexes = {
        @Index(name = "idx_user_status", columnList = "user_id, status"),
        @Index(name = "idx_problem_status", columnList = "problem_id, status")
    }
)
public class UserProblemStatus {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProblemStatus status;
    
    @Column(name = "last_attempted", nullable = false)
    private LocalDateTime lastAttempted;
    
    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        lastAttempted = LocalDateTime.now();
    }
    
    // Constructors
    public UserProblemStatus() {
    }
    
    public UserProblemStatus(User user, Problem problem, ProblemStatus status) {
        this.user = user;
        this.problem = problem;
        this.status = status;
        this.lastAttempted = LocalDateTime.now();
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
    
    public ProblemStatus getStatus() {
        return status;
    }
    
    public void setStatus(ProblemStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getLastAttempted() {
        return lastAttempted;
    }
    
    public void setLastAttempted(LocalDateTime lastAttempted) {
        this.lastAttempted = lastAttempted;
    }
}
