package com.localcode.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class for resource limits during code execution.
 */
@Configuration
@ConfigurationProperties(prefix = "execution.limits")
public class ResourceLimits {
    
    private Integer defaultTimeLimitMs = 2000;  // 2 seconds default
    private Integer defaultMemoryLimitMb = 256;  // 256 MB default
    private Integer maxContainerLifetimeSeconds = 30;  // 30 seconds max
    private Long cpuQuota = 100000L;  // 1 CPU core (100000 microseconds per 100ms period)
    private Long cpuPeriod = 100000L;  // 100ms period
    private Integer maxCodeSizeKb = 50;  // 50 KB max code size
    private Integer maxTestCaseSizeKb = 10;  // 10 KB max test case size
    
    // Constructors
    public ResourceLimits() {
    }
    
    // Getters and Setters
    public Integer getDefaultTimeLimitMs() {
        return defaultTimeLimitMs;
    }
    
    public void setDefaultTimeLimitMs(Integer defaultTimeLimitMs) {
        this.defaultTimeLimitMs = defaultTimeLimitMs;
    }
    
    public Integer getDefaultMemoryLimitMb() {
        return defaultMemoryLimitMb;
    }
    
    public void setDefaultMemoryLimitMb(Integer defaultMemoryLimitMb) {
        this.defaultMemoryLimitMb = defaultMemoryLimitMb;
    }
    
    public Integer getMaxContainerLifetimeSeconds() {
        return maxContainerLifetimeSeconds;
    }
    
    public void setMaxContainerLifetimeSeconds(Integer maxContainerLifetimeSeconds) {
        this.maxContainerLifetimeSeconds = maxContainerLifetimeSeconds;
    }
    
    public Long getCpuQuota() {
        return cpuQuota;
    }
    
    public void setCpuQuota(Long cpuQuota) {
        this.cpuQuota = cpuQuota;
    }
    
    public Long getCpuPeriod() {
        return cpuPeriod;
    }
    
    public void setCpuPeriod(Long cpuPeriod) {
        this.cpuPeriod = cpuPeriod;
    }
    
    public Integer getMaxCodeSizeKb() {
        return maxCodeSizeKb;
    }
    
    public void setMaxCodeSizeKb(Integer maxCodeSizeKb) {
        this.maxCodeSizeKb = maxCodeSizeKb;
    }
    
    public Integer getMaxTestCaseSizeKb() {
        return maxTestCaseSizeKb;
    }
    
    public void setMaxTestCaseSizeKb(Integer maxTestCaseSizeKb) {
        this.maxTestCaseSizeKb = maxTestCaseSizeKb;
    }
}
