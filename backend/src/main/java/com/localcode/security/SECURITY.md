# Security Measures

This document outlines the security measures implemented in the LocalCode backend application.

## Input Validation

### 1. Annotation-Based Validation

All DTOs use Jakarta Bean Validation annotations to enforce input constraints:

- **RegisterRequest**: 
  - `@NotBlank` for username, email, password
  - `@Email` for email format validation
  - `@Size` constraints (username: 3-50 chars, password: min 8 chars, email: max 100 chars)

- **LoginRequest**:
  - `@NotBlank` for username and password

- **SubmissionRequest**:
  - `@NotNull` for problemId
  - `@NotBlank` for code and language
  - `@Size(max = 51200)` for code (50KB limit)

- **CustomTestCaseRequest**:
  - `@NotBlank` for input and expectedOutput
  - `@Size(max = 10240)` for both fields (10KB limit each)

- **CreateProblemRequest**:
  - `@NotBlank` for title, description, difficulty
  - `@Size(max = 200)` for title
  - `@NotNull` and `@Positive` for timeLimitMs and memoryLimitMb

### 2. Controller Validation

All controllers use `@Valid` annotation on request body parameters to trigger automatic validation:

```java
@PostMapping
public ResponseEntity<?> submitSolution(@Valid @RequestBody SubmissionRequest request)
```

### 3. Custom Validation Service

The `ValidationService` provides additional business logic validation:

- **Code Size Validation**: Maximum 50KB (51,200 bytes)
- **Test Case Size Validation**: Maximum 10KB (10,240 bytes) per input/output
- **Language Validation**: Only java, python, javascript are supported

## SQL Injection Prevention

### JPA Parameterized Queries

All database queries use Spring Data JPA's built-in parameterized query mechanism:

1. **Method Name Queries**: Spring Data JPA automatically generates safe parameterized queries
   ```java
   Optional<User> findByUsername(String username);
   List<Submission> findByUserIdAndStatus(Long userId, SubmissionStatus status);
   ```

2. **@Query with Named Parameters**: Custom queries use named parameters (`:paramName`)
   ```java
   @Query("SELECT DISTINCT s.problem.id FROM Submission s WHERE s.user.id = :userId")
   List<Long> findSolvedProblemIdsByUserId(@Param("userId") Long userId);
   ```

3. **No String Concatenation**: No raw SQL queries with string concatenation are used anywhere in the codebase

### Entity Relationships

JPA entity relationships use proper foreign key constraints and cascading rules, preventing orphaned records and maintaining referential integrity.

## Rate Limiting

### Implementation

Rate limiting is implemented using the Bucket4j library with a token bucket algorithm:

1. **Submission Rate Limit**: 10 submissions per minute per user
   - Applied to `POST /api/submissions`
   - Prevents abuse of code execution resources

2. **General API Rate Limit**: 100 requests per minute per user
   - Applied to all `/api/**` endpoints except auth endpoints
   - Prevents API abuse and DoS attacks

### Configuration

- **RateLimitConfig**: Manages bucket creation and configuration
- **RateLimitInterceptor**: Intercepts requests and enforces rate limits
- **WebConfig**: Registers the interceptor for API endpoints

### Response Headers

Rate limit information is included in response headers:
- `X-Rate-Limit-Remaining`: Number of remaining requests
- `X-Rate-Limit-Retry-After-Seconds`: Seconds to wait before retrying (when limit exceeded)

### HTTP Status

When rate limit is exceeded, the API returns:
- Status Code: `429 Too Many Requests`
- Error Message: Descriptive message with retry time

## Authentication & Authorization

### Password Security

- **BCrypt Hashing**: Passwords are hashed using BCrypt with 12 salt rounds
- **No Plain Text Storage**: Passwords are never stored in plain text
- **Secure Comparison**: Password verification uses BCrypt's secure comparison

### JWT Token Security

- **Token Expiration**: Access tokens expire after 1 hour
- **Secure Secret**: JWT secret key is stored in environment variables
- **Token Validation**: All protected endpoints validate JWT tokens

### Authorization Checks

- **User Ownership**: Services verify that users can only access their own resources
  - Submissions: Users can only view their own submissions
  - Custom Test Cases: Users can only modify their own test cases
  
- **Authentication Required**: All API endpoints (except auth) require valid JWT token

## Code Execution Security

### Container Isolation

Code execution happens in isolated Docker containers with:
- No network access
- Read-only file system (except /tmp)
- Limited container lifetime (max 30 seconds)
- Resource limits (CPU, memory)

See `CODE_EXECUTION.md` for detailed security measures.

## Error Handling

### Global Exception Handler

The `GlobalExceptionHandler` provides:
- Standardized error responses
- No sensitive information leakage
- Proper HTTP status codes
- Detailed logging for debugging (server-side only)

### Validation Error Responses

Validation errors return:
- Status Code: `400 Bad Request`
- Error Message: Clear description of validation failure
- No stack traces or internal details

## Best Practices

1. **Principle of Least Privilege**: Users can only access their own data
2. **Defense in Depth**: Multiple layers of validation and security checks
3. **Fail Securely**: Errors result in denied access, not granted access
4. **Secure Defaults**: All endpoints require authentication by default
5. **Input Validation**: All user input is validated before processing
6. **Output Encoding**: JPA handles proper SQL escaping automatically
7. **Logging**: Security events are logged without exposing sensitive data

## Future Enhancements

Potential security improvements for future versions:

1. **HTTPS Enforcement**: Require HTTPS in production
2. **CSRF Protection**: Add CSRF tokens for state-changing operations
3. **Account Lockout**: Lock accounts after multiple failed login attempts
4. **Password Complexity**: Enforce stronger password requirements
5. **Refresh Tokens**: Implement refresh token rotation
6. **Role-Based Access Control**: Add admin roles for problem management
7. **Audit Logging**: Track all security-relevant events
8. **IP-Based Rate Limiting**: Add rate limiting by IP address
9. **Content Security Policy**: Add CSP headers for XSS protection
10. **Security Headers**: Add additional security headers (HSTS, X-Frame-Options, etc.)
