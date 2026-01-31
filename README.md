# LocalCode

A self-hosted coding practice platform. Think LeetCode, but running on your own machine.

## What is this?

LocalCode lets you practice coding problems offline. You get a problem, write your solution, hit submit, and the platform runs your code against test cases — all without touching the internet.

It's useful if you're preparing for interviews, teaching a class, or just want a private space to sharpen your skills.

## How it works

The platform has three main pieces:

1. A **React frontend** where you browse problems and write code
2. A **Spring Boot backend** that handles authentication, stores problems, and orchestrates everything
3. **Docker containers** that execute your code in isolation (so your solution can't accidentally `rm -rf` anything important)

When you submit a solution, the backend spins up a fresh container, runs your code against the test cases, captures the output, and tears down the container. Each execution is completely isolated.

## Project structure

```
localcode/
├── backend/           # Spring Boot API
├── frontend/          # React + Vite app
├── runtimes/          # Dockerfiles for code execution (Java, Python, JS)
├── .devcontainer/     # Dev container setup for local development
├── docker-compose.yml # Production-ish setup
└── Makefile           # Handy shortcuts
```

## Prerequisites

You'll need:
- Docker or Podman 
- Java 17+ (for backend development)
- Node.js 18+ (for frontend development)
- Maven 3.8+

## Getting started

### The quick way (Docker Compose)

Build everything:
```bash
make build
```

Start the services:
```bash
make start
```

That's it. Open your browser:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api

To stop:
```bash
make stop
```

### Development mode

If you want hot reload and a nicer dev experience:

```bash
make dev
```

This uses the dev container setup in `.devcontainer/` and gives you live reloading for both frontend and backend changes.

### Running things manually

Backend:
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Sample data

When the backend starts with an empty database, it automatically seeds some data:

**Users** (password shown, but stored hashed):
- `testuser` / `password123`
- `johndoe` / `password123`  
- `admin` / `admin123`

**Problems**: 13 coding problems across Easy, Medium, and Hard difficulties. Each comes with sample test cases and starter code for Java, Python, and JavaScript.

If you want to reset the database and re-seed, just clear the tables and restart the backend.

## Make commands

```bash
make help           # Show all commands
make build          # Build everything
make start          # Start with Docker Compose
make stop           # Stop services
make dev            # Start dev environment with hot reload
make dev-stop       # Stop dev environment
make clean          # Clean build artifacts and volumes
make logs           # Tail logs from all services
make backend-build  # Build just the backend
make frontend-build # Build just the frontend
make runtime-build  # Build the code execution Docker images
```

## Tech stack

**Frontend**
- React 18 with Vite
- Tailwind CSS
- Monaco Editor (the same editor VS Code uses)
- React Router

**Backend**
- Spring Boot 3.x
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL
- Bucket4j for rate limiting

**Code Execution**
- Docker containers for Java 17, Python 3.11, and Node.js 18
- Sandboxed execution with resource limits (CPU, memory, time)
- No network access from execution containers

## Configuration

Environment variables you might want to tweak:

```bash
# Database
POSTGRES_DB=localcode
POSTGRES_USER=localcode
POSTGRES_PASSWORD=localcode

# Backend
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/localcode
JWT_SECRET=your-secret-key-change-in-production

# Frontend
VITE_API_BASE_URL=http://localhost:8080/api

# Docker
DOCKER_HOST=unix:///var/run/docker.sock
```

There's an `.env.example` file you can copy and modify.

## API endpoints

Once running, the backend exposes:

- `POST /api/auth/register` — Create an account
- `POST /api/auth/login` — Get a JWT token
- `GET /api/problems` — List all problems
- `GET /api/problems/{id}` — Get problem details
- `POST /api/submissions` — Submit a solution
- `GET /api/submissions` — Your submission history
- `POST /api/testcases/custom` — Add custom test cases

Most endpoints require a valid JWT in the `Authorization` header.

## Supported languages

- Java 17
- Python 3.11
- JavaScript (Node.js 18)

Each language runs in its own Docker image. The images are minimal and locked down — no network, limited CPU/memory, read-only filesystem (except `/tmp` for your code).

## Troubleshooting

**"Cannot connect to database"**

Make sure PostgreSQL is running:
```bash
docker-compose ps
# or
podman compose ps
```

**"Docker socket not found"**

The backend needs access to Docker to run code. Check that `DOCKER_HOST` points to the right socket, and that your user has permission to use Docker.

**"Port already in use"**

Something else is using 5173 or 8080. Either stop that process or change the ports in `docker-compose.yml`.

**"Rate limit exceeded"**

The API has rate limiting: 10 submissions per minute, 100 general requests per minute. Wait a bit and try again.

## Contributing

Want to help out? Check out [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on setting up your dev environment, making changes, and submitting PRs.

Some areas that could use help:
- More coding problems
- Additional language runtimes (Go, Rust, C++, etc.)
- UI improvements
- Test coverage

## More documentation

- [Backend README](backend/README.md) — Detailed backend setup and architecture
- [Frontend README](frontend/README.md) — Frontend development guide
- [Runtimes README](runtimes/README.md) — How code execution containers work

## License

MIT
