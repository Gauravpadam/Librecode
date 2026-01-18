.PHONY: help build start stop clean logs backend-build frontend-build docker-build dev dev-stop

help:
	@echo "LocalCode Development Commands"
	@echo "=============================="
	@echo "make build          - Build all services (backend, frontend, docker images)"
	@echo "make start          - Start all services with Docker Compose"
	@echo "make stop           - Stop all services"
	@echo "make dev            - Start development environment with hot reload"
	@echo "make dev-stop       - Stop development environment"
	@echo "make clean          - Clean build artifacts"
	@echo "make logs           - View logs from all services"
	@echo "make backend-build  - Build backend only"
	@echo "make frontend-build - Build frontend only"
	@echo "make docker-build   - Build Docker images for execution environments"

build: backend-build frontend-build docker-build

backend-build:
	@echo "Building backend..."
	cd backend && mvn clean package -DskipTests

frontend-build:
	@echo "Building frontend..."
	cd frontend && npm install && npm run build

runtime-build:
	@echo "Building Docker execution images..."
	podman build -t localcode-java:latest -f runtimes/Dockerfile.java .
	podman build -t localcode-python:latest -f runtimes/Dockerfile.python .
	podman build -t localcode-javascript:latest -f runtimes/Dockerfile.javascript .

start:
	@echo "Starting LocalCode services..."
	podman compose -f ./docker-compose.yml up

stop:
	@echo "Stopping LocalCode services..."
	podman compose -f ./docker-compose.yml down

clean:
	@echo "Cleaning build artifacts..."
	cd backend && mvn clean
	cd frontend && rm -rf dist node_modules
	podman compose down -v

logs:
	docker-compose logs -f

dev-build: runtime-build

dev:
	@echo "Starting development environment..."
	podman compose -f .devcontainer/docker-compose.dev.yml up --build

dev-stop:
	@echo "Stopping development environment..."
	podman compose -f .devcontainer/docker-compose.dev.yml down

dev-clean-stop:
	@echo "Stopping development environment..."
	podman compose -f .devcontainer/docker-compose.dev.yml down -v
