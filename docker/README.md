# LocalCode Docker Execution Environments

Docker images for secure code execution in isolated containers.

## Images

- `Dockerfile.java` - Java 17 execution environment
- `Dockerfile.python` - Python 3.11 execution environment
- `Dockerfile.javascript` - Node.js 18 execution environment

## Building Images

```bash
make docker-build
```

Or build individually:
```bash
docker build -t localcode-java:latest -f Dockerfile.java .
docker build -t localcode-python:latest -f Dockerfile.python .
docker build -t localcode-javascript:latest -f Dockerfile.javascript .
```

## Security Features

- Non-root user execution
- No network access
- Read-only file system (except /tmp)
- Resource limits enforced by backend
- Maximum container lifetime: 30 seconds
