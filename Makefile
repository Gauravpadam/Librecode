.PHONY: help build start stop clean logs backend-build frontend-build docker-build

help:
	@echo "LocalCode Development Commands"
	@echo "=============================="
	@echo "make build          - Build all services (backend, frontend, docker images)"
	@echo "make start          - Start all services with Docker Compose"
	@echo "make stop           - Stop all services"
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

docker-build:
	@echo "Building Docker execution images..."
	podman build -t localcode-java:latest -f docker/Dockerfile.java docker/
	podman build -t localcode-python:latest -f docker/Dockerfile.python docker/
	podman build -t localcode-javascript:latest -f docker/Dockerfile.javascript docker/

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
