# LocalCode Backend

Spring Boot backend application for LocalCode coding practice platform.

## Technology Stack

- **Java**: 17+
- **Spring Boot**: 3.2.0
- **Database**: PostgreSQL 15+
- **Build Tool**: Maven
- **Security**: Spring Security with JWT
- **Code Execution**: Docker Java Client

## Project Structure

```
src/
├── main/
│   ├── java/com/localcode/
│   │   ├── LocalCodeApplication.java    # Main application class
│   │   ├── config/                      # Configuration classes
│   │   ├── controllers/                 # REST API controllers
│   │   ├── services/                    # Business logic layer
│   │   ├── persistence/                 # Data access layer
│   │   │   ├── entity/                  # JPA entities
│   │   │   └── repository/              # Spring Data repositories
│   │   ├── dto/                         # Data Transfer Objects
│   │   ├── security/                    # Security components
│   │   └── exception/                   # Custom exceptions
│   └── resources/
│       ├── application.properties       # Default configuration
│       ├── application-dev.properties   # Development profile
│       └── application-prod.properties  # Production profile
└── test/
    ├── java/com/localcode/             # Test classes
    └── resources/
        └── application-test.properties  # Test configuration
```

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 15+ (or use Docker Compose)
- Docker (for code execution)

## Configuration

### Database Setup

The application requires a PostgreSQL database. You can either:

1. **Use Docker Compose** (recommended for development):
   ```bash
   cd ..
   docker-compose up -d postgres
   ```

2. **Use local PostgreSQL**:
   - Create a database named `localcode`
   - Update `application.properties` with your credentials

### Application Properties

Configuration files are located in `src/main/resources/`:

- `application.properties` - Default configuration
- `application-dev.properties` - Development profile (uses Docker Compose services)
- `application-prod.properties` - Production profile (uses environment variables)

Key configuration properties:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/localcode
spring.datasource.username=localcode
spring.datasource.password=localcode

# JWT
jwt.secret=your-secret-key-change-this-in-production
jwt.expiration=3600000

# Docker
docker.host=unix:///var/run/docker.sock
```

## Building and Running

### Development Mode

```bash
# Build the project
mvn clean install

# Run with development profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Or run the JAR
java -jar target/localcode-backend-1.0.0.jar --spring.profiles.active=dev
```

### Production Mode

```bash
# Build the project
mvn clean package -DskipTests

# Run with production profile
java -jar target/localcode-backend-1.0.0.jar --spring.profiles.active=prod
```

### Using Docker Compose

```bash
# From the project root
cd ..
docker-compose up backend
```

## Testing

```bash
# Run all tests
mvn test

# Run tests with coverage
mvn test jacoco:report

# Run specific test class
mvn test -Dtest=LocalCodeApplicationTests
```

## API Documentation

Once the application is running, the API will be available at:
- Base URL: `http://localhost:8080/api`

Main endpoints:
- `/api/auth/*` - Authentication endpoints
- `/api/problems/*` - Problem management
- `/api/submissions/*` - Code submission and evaluation
- `/api/testcases/*` - Custom test case management

## Development

### Three-Tier Architecture

The application follows a three-tier architecture:

1. **Controllers** (`controllers/`) - Handle HTTP requests and responses
2. **Services** (`services/`) - Implement business logic
3. **Persistence** (`persistence/`) - Data access and JPA entities

### Adding New Features

1. Create entity in `persistence/entity/`
2. Create repository in `persistence/repository/`
3. Create DTOs in `dto/`
4. Implement service in `services/`
5. Create controller in `controllers/`
6. Add tests in `src/test/`

## Dependencies

Key dependencies configured in `pom.xml`:

- Spring Boot Starter Web
- Spring Boot Starter Security
- Spring Boot Starter Data JPA
- PostgreSQL Driver
- JWT (jjwt)
- Docker Java Client
- Lombok (optional)

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running: `docker-compose ps`
- Check database credentials in `application.properties`
- Ensure database `localcode` exists

### Docker Connection Issues

- Verify Docker daemon is running: `docker ps`
- Check Docker socket path in configuration
- Ensure user has Docker permissions

### Port Already in Use

- Change server port in `application.properties`:
  ```properties
  server.port=8081
  ```

## Next Steps

After setting up the backend:

1. Implement database entities (Task 4)
2. Set up authentication system (Task 5)
3. Implement problem management (Task 6)
4. Build code execution engine (Task 8)
