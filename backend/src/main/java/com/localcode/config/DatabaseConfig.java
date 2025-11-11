package com.localcode.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Database configuration for JPA and repositories
 */
@Configuration
@EnableJpaRepositories(basePackages = "com.localcode.persistence.repository")
@EntityScan(basePackages = "com.localcode.persistence.entity")
@EnableTransactionManagement
public class DatabaseConfig {
    // Additional database configuration can be added here if needed
}
