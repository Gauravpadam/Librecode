# Input Validation and Security Measures

This document summarizes the input validation and security measures implemented in the LocalCode backend application.

## ✅ Implemented Features

### 1. Validation Annotations on DTOs

All Data Transfer Objects (DTOs) have comprehensive validation annotations:

#### RegisterRequest
- `@NotBlank` - username, email, password required
- `@Email` - valid email format
- `@Size(min=3, max=50)` - username length
- `@Size(min=8)` - minimum password length
- `@Size(max=100)` - maximum email length

#### LoginRequest
- `@NotBlank` - username and password required

#### SubmissionRequest
- `@NotNull` - problemId required
- `@NotBlank` - code and language required
- `@Size(max=51200)` - **code size limited to 50KB**

#### CustomTestCaseRequest
- `@NotBlank` - input and expectedOutput required
- `@Size(max=10240)` - **input limited to 10KB**
- `@Size(max=10240)` - **expectedOutput limited to 10KB**

#### CreateProblemRequest
- `@NotBlank` - title, description, difficulty required
- `@Size(max=200)` - title length limit
- `@NotNull` and `@Positive` - timeLimitMs and memoryLimitMb validation
- Nested TestCaseRequest validation

### 2. Controller Validation

All controllers use `@Valid` annotation to trigger automatic validation:

```java
@PostMapping
public ResponseEntity<?> submitSolution(@Valid @RequestBody SubmissionRequest request)
```

Controllers with validation:
- ✅ AuthenticationController (register, login)
- ✅ SubmissionController (submit solution)
- ✅ TestCaseController (add, update custom test cases)
- ✅ ProblemController (create problem)

### 3. Code Size Validation

**Maximum code size: 50KB (51,200 bytes)**

Implemented in:
- `SubmissionRequest` DTO with `@Size(max=51200)` annotation
- `ValidationService.validateCodeSize()` method for additional checks

### 4. Test Case Size Validation

**Maximum test case size: 10KB (10,240 bytes) per input/output**

Implemented in:
- `CustomTestCaseRequest` DTO with `@Size(max=10240)` annotations
- `ValidationService.validateTestCaseInputSize()` method
- `ValidationService.validateTestCaseOutputSize()` method

### 5. Rate Limiting

**Submission Rate Limit: 10 submissions per minute per user**
**General API Rate Limit: 100 requests per minute per user**

Implemented using Bucket4j library:

#### Components:
- **RateLimitConfig**: Manages token buckets for rate limiting
  - `resolveSubmissionBucket()` - 10 requests/minute for submissions
  - `resolveApiBucket()` - 100 requests/minute for general API

- **RateLimitInterceptor**: Intercepts requests and enforces limits
  - Checks user authentication
  - Applies stricter limit for POST /api/submissions
  - Returns 429 Too Many Requests when limit exceeded
  - Adds rate limit headers to responses

- **WebConfig**: Registers interceptor for all `/api/**` endpoints
  - Excludes `/api/auth/register` and `/api/auth/login`

#### Response Headers:
- `X-Rate-Limit-Remaining` - remaining requests in current window
- `X-Rate-Limit-Retry-After-Seconds` - seconds to wait when limit exceeded

#### HTTP Status:
- `429 Too Many Requests` - when rate limit is exceeded

### 6. SQL Injection Prevention

**All database queries use parameterized queries via Spring Data JPA**

#### Method Name Queries:
```java
Optional<User> findByUsername(String username);
List<Submission> findByUserIdAndStatus(Long userId, SubmissionStatus status);
```

#### @Query with Named Parameters:
```java
@Query("SELECT DISTINCT s.problem.id FROM Submission s WHERE s.user.id = :userId")
List<Long> findSolvedProblemIdsByUserId(@Param("userId") Long userId);
```

#### Security Features:
- ✅ No raw SQL with string concatenation
- ✅ All parameters are properly escaped by JPA
- ✅ Named parameters prevent injection attacks
- ✅ Type-safe query methods

### 7. Additional Security Services

#### ValidationService
Provides centralized validation logic:
- `validateCodeSize()` - ensures code doesn't exceed 50KB
- `validateTestCaseInputSize()` - ensures input doesn't exceed 10KB
- `validateTestCaseOutputSize()` - ensures output doesn't exceed 10KB
- `validateLanguage()` - ensures only supported languages (java, python, javascript)

### 8. Global Exception Handling

The `GlobalExceptionHandler` provides:
- Standardized error responses
- Proper HTTP status codes
- No sensitive information leakage
- Validation error messages

## 📋 Requirements Coverage

### Requirement 5.5 (Secure Code Execution)
✅ Resource limits enforced (covered in previous tasks)
✅ Isolated execution environment (covered in previous tasks)
✅ Input validation prevents malicious payloads

### Requirement 6.1 (User Registration)
✅ Username validation (3-50 characters, required)
✅ Email validation (valid format, max 100 characters)
✅ Password validation (min 8 characters, required)

### Requirement 6.2 (Password Security)
✅ Password hashing with BCrypt (covered in previous tasks)
✅ Secure password storage (covered in previous tasks)
✅ Input validation prevents weak passwords

## 🔧 Configuration

### Maven Dependencies
Added to `pom.xml`:
```xml
<dependency>
    <groupId>com.bucket4j</groupId>
    <artifactId>bucket4j-core</artifactId>
    <version>8.7.0</version>
</dependency>
```

### Spring Boot Validation
Already included via:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

## 📝 Documentation

Created comprehensive security documentation:
- `src/main/java/com/localcode/security/SECURITY.md` - detailed security measures
- This file - validation and security summary

## 🧪 Testing

To test the implementation:

1. **Validation Testing**:
   - Submit code larger than 50KB → should return 400 Bad Request
   - Submit test case larger than 10KB → should return 400 Bad Request
   - Submit invalid email format → should return 400 Bad Request
   - Submit short password (< 8 chars) → should return 400 Bad Request

2. **Rate Limiting Testing**:
   - Submit 11 solutions within 1 minute → 11th should return 429
   - Make 101 API requests within 1 minute → 101st should return 429
   - Check response headers for rate limit information

3. **SQL Injection Testing**:
   - Try SQL injection in username field → should be safely escaped
   - All queries use parameterized approach → injection not possible

## ✨ Summary

All required validation and security measures have been successfully implemented:

✅ Validation annotations on all DTOs  
✅ Code size validation (max 50KB)  
✅ Test case size validation (max 10KB per field)  
✅ Rate limiting (10 submissions/min, 100 API requests/min)  
✅ SQL injection prevention via parameterized queries  
✅ Controller-level validation with @Valid  
✅ Custom validation service for business logic  
✅ Comprehensive security documentation  

The application now has robust input validation and security measures in place to protect against common vulnerabilities and abuse.
