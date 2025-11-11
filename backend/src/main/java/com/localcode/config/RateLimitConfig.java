package com.localcode.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Configuration for rate limiting.
 * Uses token bucket algorithm to limit API requests per user.
 */
@Configuration
public class RateLimitConfig {
    
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();
    
    /**
     * Get or create a bucket for submission rate limiting.
     * Limit: 10 submissions per minute per user.
     *
     * @param key the user identifier
     * @return the bucket for rate limiting
     */
    public Bucket resolveSubmissionBucket(String key) {
        return cache.computeIfAbsent(key, k -> createSubmissionBucket());
    }
    
    /**
     * Get or create a bucket for general API rate limiting.
     * Limit: 100 requests per minute per user.
     *
     * @param key the user identifier
     * @return the bucket for rate limiting
     */
    public Bucket resolveApiBucket(String key) {
        return cache.computeIfAbsent(key + "_api", k -> createApiBucket());
    }
    
    private Bucket createSubmissionBucket() {
        Bandwidth limit = Bandwidth.classic(10, Refill.intervally(10, Duration.ofMinutes(1)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
    
    private Bucket createApiBucket() {
        Bandwidth limit = Bandwidth.classic(100, Refill.intervally(100, Duration.ofMinutes(1)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
}
