.PHONY: help build start stop clean logs backend-build frontend-build docker-build dev dev-stop env

# Detect container engine: podman, nerdctl, or docker (default)
CONTAINER_ENGINE ?= $(shell (command -v podman >/dev/null 2>&1 && echo podman) || (command -v nerdctl >/dev/null 2>&1 && echo nerdctl) || (command -v docker >/dev/null 2>&1 && echo docker) || echo docker)


help:
	@echo "LocalCode Development Commands"
	@echo "=============================="
	@echo "make build          - Build all services (backend, frontend, docker images)"
	@echo "make start          - Start all services with $(COMPOSE) (set CONTAINER_ENGINE to override)"
	@echo "make stop           - Stop all services"
	@echo "make dev            - Start development environment with hot reload"
	@echo "make dev-stop       - Stop development environment"
	@echo "make clean          - Clean build artifacts"
	@echo "make logs           - View logs from all services"
	@echo "make backend-build  - Build backend only"
	@echo "make frontend-build - Build frontend only"
	@echo "make docker-build   - Build container runtime images (alias for runtime-build)"
	@echo "make env            - Print detected container engine and compose command"




build: backend-build frontend-build docker-build

backend-build:
	@echo "Building backend..."
	cd backend && mvn clean package -DskipTests

frontend-build:
	@echo "Building frontend..."
	cd frontend && npm install && npm run build

runtime-build:
	@echo "Building container runtime images using $(CONTAINER_ENGINE)..."
	$(CONTAINER_ENGINE) build -t localcode-java:latest -f runtimes/Dockerfile.java .
	$(CONTAINER_ENGINE) build -t localcode-python:latest -f runtimes/Dockerfile.python .
	$(CONTAINER_ENGINE) build -t localcode-javascript:latest -f runtimes/Dockerfile.javascript .

docker-build: runtime-build

start:
	@echo "Starting LocalCode services using $(CONTAINER_ENGINE)..."
	$(CONTAINER_ENGINE) compose -f ./docker-compose.yml up -d

stop:
	@echo "Stopping LocalCode services..."
	$(CONTAINER_ENGINE) compose -f ./docker-compose.yml down
clean:
	@echo "Cleaning build artifacts..."
	cd backend && mvn clean
	cd frontend && rm -rf dist node_modules
	$(CONTAINER_ENGINE) compose -f ./docker-compose.yml down -v

logs:
	@echo "Streaming logs from services using $(CONTAINER_ENGINE)..."
	$(CONTAINER_ENGINE) compose -f ./docker-compose.yml logs -f
dev-build: runtime-build

dev:
	@echo "Starting development environment using $(CONTAINER_ENGINE)..."
	$(CONTAINER_ENGINE) compose -f .devcontainer/docker-compose.dev.yml up --build -d

dev-stop:
	@echo "Stopping development environment..."
	$(CONTAINER_ENGINE) compose -f .devcontainer/docker-compose.dev.yml down
dev-clean-stop:
	@echo "Stopping development environment..."
	$(CONTAINER_ENGINE) compose -f .devcontainer/docker-compose.dev.yml down -v