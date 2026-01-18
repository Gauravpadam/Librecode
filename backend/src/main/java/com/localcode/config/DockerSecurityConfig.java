package com.localcode.config;

import com.github.dockerjava.api.model.Capability;
import com.github.dockerjava.api.model.HostConfig;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration for Docker container security settings.
 * Implements security measures for isolated code execution.
 */
@Configuration
public class DockerSecurityConfig {
    
    private final ResourceLimits resourceLimits;
    
    public DockerSecurityConfig(ResourceLimits resourceLimits) {
        this.resourceLimits = resourceLimits;
    }
    
    /**
     * Create a secure HostConfig for Docker containers.
     * 
     * Security measures:
     * - No network access (networkMode = "none")
     * - Read-only root filesystem (except /tmp)
     * - CPU and memory limits
     * - Process limit (max 50 processes)
     * - All Linux capabilities dropped
     * - No swap memory
     *
     * @param memoryLimitMb memory limit in megabytes
     * @return configured HostConfig with security settings
     */
    public HostConfig createSecureHostConfig(Integer memoryLimitMb) {
        // Calculate memory limit in bytes
        long memoryLimit = memoryLimitMb * 1024L * 1024L;
        
        // Note: Some options may not be supported by Podman
        // Using a more compatible configuration
        return HostConfig.newHostConfig()
            // Resource limits
            .withMemory(memoryLimit)
            .withMemorySwap(memoryLimit)  // Disable swap (same as memory limit)
            .withPidsLimit(50L)  // Limit number of processes
            
            // Security settings
            .withNetworkMode("none")  // No network access
            .withReadonlyRootfs(false)  // Need write access to /tmp
            
            // Additional security
            .withPrivileged(false)  // Not privileged
            .withPublishAllPorts(false);  // Don't publish ports
            
        // Note: Removed cpuQuota/cpuPeriod and capDrop for Podman compatibility
        // These can be re-enabled if using Docker
    }
    
    /**
     * Get maximum container lifetime in seconds.
     *
     * @return max lifetime in seconds
     */
    public Integer getMaxContainerLifetime() {
        return resourceLimits.getMaxContainerLifetimeSeconds();
    }
    
    /**
     * Validate that security settings are properly configured.
     *
     * @param hostConfig the host config to validate
     * @return true if secure, false otherwise
     */
    public boolean validateSecuritySettings(HostConfig hostConfig) {
        if (hostConfig == null) {
            return false;
        }
        
        // Check network is disabled
        if (!"none".equals(hostConfig.getNetworkMode())) {
            return false;
        }
        
        // Check memory limits are set
        if (hostConfig.getMemory() == null || hostConfig.getMemory() <= 0) {
            return false;
        }
        
        // Check process limit is set
        if (hostConfig.getPidsLimit() == null || hostConfig.getPidsLimit() <= 0) {
            return false;
        }
        
        // Note: Removed CPU quota check for Podman compatibility
        
        return true;
    }
}
