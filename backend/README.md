# LocalCode Backend

The Spring Boot API that powers LocalCode. It handles user authentication, stores problems and submissions, and orchestrates code execution in Docker containers.

## How it fits together

When a user submits code, here's what happens:

1. The frontend sends the code to this backend
2. The backend validates the request (is the user logged in? is the code too large?)
3. It spins up a Docker container with the appropriate runtime (Java, Python, or JS)
4. The code runs against test cases inside that container
5. Results come back, the container gets destroyed, and the user sees their score

All of this happens in a few seconds.

## Project structure

```
src/main/java/com/localcode/
├── LocalCodeApplication.java    # Entry point
├── config/                      # Configuration (security, database, rate limiting)
├── controllers/                 # REST endpoints
├── services/                    # Business logic
├── persistence/
│   ├── entity/                  # JPA entities (User, Problem, Submission, etc.)
│   └── repository/              # Spring Data repositories
├── dto/                         # Request/response objects
├── security/                    # JWT filter and auth components
└── exception/                   # Custom exceptions and error handling
```

## Prerequisites

- Java 17+
- Maven 3.6+
- PostgreSQL 15+ (or just use Docker Compose from the root)
- Docker (for code execution)

## Running locally

The easiest way is to start PostgreSQL via Docker Compose from the project root:

```bash
# From the root directory
docker-compose up -d postgres
```

Then run the backend:

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

The API will be available at `http://localhost:8080/api`.

## Configuration

There are three property files in `src/main/resources/`:

- `application.properties` — defaults
- `application-dev.properties` — development settings
- `application-prod.properties` — production (uses environment variables)

Key settings you might want to change:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/localcode
spring.datasource.username=localcode
spring.datasource.password=localcode

# JWT (change this in production!)
jwt.secret=your-secret-key-change-this-in-production
jwt.expiration=3600000

# Docker socket for code execution
docker.host=unix:///var/run/docker.sock

# Code execution limits
execution.limits.default-time-limit-ms=2000
execution.limits.default-memory-limit-mb=256
execution.limits.max-code-size-kb=50
```

## API endpoints

### Authentication
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Get JWT token

### Problems
- `GET /api/problems` — List all problems
- `GET /api/problems/{id}` — Get problem details with test cases
- `POST /api/problems` — Create a problem (admin)

### Submissions
- `POST /api/submissions` — Submit a solution
- `GET /api/submissions` — Your submission history
- `GET /api/submissions/{id}` — Submission details with test results

### Test Cases
- `POST /api/testcases/custom` — Add a custom test case
- `GET /api/testcases/custom/problem/{problemId}` — Get your custom test cases
- `DELETE /api/testcases/custom/{id}` — Delete a custom test case

Most endpoints require a JWT token in the `Authorization: Bearer <token>` header.

## Database seeding

When the backend starts with an empty database, it automatically creates sample data:

- 3 test users (`testuser`, `johndoe`, `admin`)
- 13 coding problems (5 Easy, 5 Medium, 3 Hard)
- Test cases for each problem

This only happens once. If you want to re-seed, clear the tables and restart.

## Rate limiting

The API has built-in rate limiting to prevent abuse:

- 10 submissions per minute per user
- 100 general API requests per minute per user

When you hit the limit, you'll get a `429 Too Many Requests` response with headers telling you when to retry.

## Input validation

All inputs are validated:

- Code submissions: max 50KB
- Test case inputs/outputs: max 10KB each
- Passwords: minimum 8 characters
- Usernames: 3-50 characters

Invalid requests get a `400 Bad Request` with details about what's wrong.

## Testing

```bash
# Run all tests
mvn test

# Run with coverage report
mvn test jacoco:report
```

Tests use an in-memory H2 database, so you don't need PostgreSQL running.

## Building for production

```bash
mvn clean package -DskipTests
java -jar target/localcode-backend-1.0.0.jar --spring.profiles.active=prod
```

In production, set these environment variables:
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET` (use a strong, random key)

## Tech stack

- Spring Boot 3.2
- Spring Security with JWT (jjwt 0.12.3)
- Spring Data JPA
- PostgreSQL
- Docker Java Client 3.3.4
- Bucket4j for rate limiting
- Lombok (optional)

## Troubleshooting

**"Cannot connect to database"**

Make sure PostgreSQL is running. If using Docker Compose:
```bash
docker-compose ps
```

**"Docker socket not found"**

The backend needs Docker access to run code. Check that:
1. Docker is running
2. The `docker.host` property points to the right socket
3. Your user has permission to access Docker

**"JWT signature does not match"**

The JWT secret changed between when the token was issued and now. Log in again to get a fresh token.
