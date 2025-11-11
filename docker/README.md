# LocalCode Docker Execution Environments

Docker images for secure code execution in isolated containers.

## Images

- `Dockerfile.java` - Java 17 execution environment
- `Dockerfile.python` - Python 3.11 execution environment
- `Dockerfile.javascript` - Node.js 18 execution environment

## Building Images

From the `localcode/docker` directory:

```bash
# Build all images
docker build -t localcode-java:latest -f Dockerfile.java .
docker build -t localcode-python:latest -f Dockerfile.python .
docker build -t localcode-javascript:latest -f Dockerfile.javascript .
```

Or from the root `localcode` directory using the Makefile:
```bash
make docker-build
```

## Security Features

All containers are configured with the following security measures:

### Container-Level Security
- **Non-root user execution**: Runs as `nobody` user
- **No network access**: Network mode set to `none`
- **Read-only file system**: Root filesystem is read-only (except /tmp for code execution)
- **Limited processes**: Maximum 50 processes per container
- **All capabilities dropped**: No Linux capabilities granted

### Resource Limits (enforced by backend)
- **CPU**: 1 core maximum (100000 microseconds per 100ms period)
- **Memory**: Configurable per problem (default 256MB)
- **Time**: Configurable per problem (default 2 seconds)
- **Container lifetime**: Maximum 30 seconds
- **Code size**: Maximum 50KB
- **Test case size**: Maximum 10KB per test case

### Execution Isolation
- Each code execution runs in a fresh container
- Containers are destroyed immediately after execution
- No data persists between executions
- No access to host file system or other containers

## Usage

The Docker images are used automatically by the `CodeExecutorService` in the backend. The service:

1. Creates a container with security and resource limits
2. Copies the user's code and test input to `/tmp/code`
3. Executes the code with timeout enforcement
4. Captures output, errors, and resource metrics
5. Destroys the container

## Testing Images

You can test the images manually:

```bash
# Java
docker run --rm -it localcode-java:latest bash

# Python
docker run --rm -it localcode-python:latest bash

# JavaScript
docker run --rm -it localcode-javascript:latest bash
```

Note: The containers run as `nobody` user, so you have limited permissions.
