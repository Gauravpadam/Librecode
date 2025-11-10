# LocalCode

A self-hosted coding practice platform similar to LeetCode for offline environments.

## Project Structure

```
localcode/
├── backend/          # Spring Boot backend application
├── frontend/         # React + Vite frontend application
├── docker/           # Docker images for code execution environments
├── docker-compose.yml # Docker Compose configuration
├── Makefile          # Build and run commands
└── README.md         # This file
```

## Prerequisites

- Docker and Docker Compose
- Java 17+ (for local backend development)
- Node.js 18+ (for local frontend development)
- Maven 3.8+ (for backend builds)

## Quick Start

### Using Docker Compose (Recommended)

1. Build all services:
   ```bash
   make build
   ```

2. Start all services:
   ```bash
   make start
   ```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080/api

4. Stop all services:
   ```bash
   make stop
   ```

### Local Development

#### Backend
```bash
cd backend
mvn spring-boot:run
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Available Make Commands

- `make help` - Display available commands
- `make build` - Build all services
- `make start` - Start all services with Docker Compose
- `make stop` - Stop all services
- `make clean` - Clean build artifacts
- `make logs` - View logs from all services
- `make backend-build` - Build backend only
- `make frontend-build` - Build frontend only
- `make docker-build` - Build Docker execution images

## Technology Stack

- **Frontend**: React 18+, Vite, Tailwind CSS
- **Backend**: Java Spring Boot 3.x, Spring Security, Spring Data JPA
- **Database**: PostgreSQL 15+
- **Code Execution**: Docker containers (Java, Python, JavaScript)

## Configuration

### Environment Variables

Backend environment variables (set in docker-compose.yml or application.properties):
- `SPRING_DATASOURCE_URL` - PostgreSQL connection URL
- `SPRING_DATASOURCE_USERNAME` - Database username
- `SPRING_DATASOURCE_PASSWORD` - Database password
- `JWT_SECRET` - Secret key for JWT token generation
- `DOCKER_HOST` - Docker socket path for code execution

Frontend environment variables:
- `VITE_API_BASE_URL` - Backend API base URL

## Development Workflow

1. Make changes to backend or frontend code
2. Rebuild the specific service: `make backend-build` or `make frontend-build`
3. Restart services: `make stop && make start`
4. View logs: `make logs`

## Next Steps

- Set up backend Spring Boot project (Task 2)
- Set up frontend React project (Task 3)
- Implement database schema and entities (Task 4)

## License

MIT
