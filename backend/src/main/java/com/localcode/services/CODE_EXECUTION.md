# Code Execution System

## Overview

The code execution system provides secure, isolated execution of user-submitted code in Docker containers with resource limits and security constraints.

## Components

### 1. DTOs (Data Transfer Objects)

#### ExecutionRequest
- Contains code, language, input, and resource limits
- Used to request code execution

#### ExecutionResult
- Contains execution status, output, error messages, and metrics
- Returned after code execution completes

#### ExecutionStatus (Enum)
- `SUCCESS`: Code executed successfully
- `COMPILATION_ERROR`: Code failed to compile
- `RUNTIME_ERROR`: Code crashed during execution
- `TLE`: Time Limit Exceeded
- `MLE`: Memory Limit Exceeded

#### ResourceMetrics
- Tracks runtime (milliseconds) and memory usage (kilobytes)

### 2. Configuration

#### ResourceLimits
- Configurable limits for code execution
- Default time limit: 2000ms (2 seconds)
- Default memory limit: 256MB
- Max container lifetime: 30 seconds
- CPU quota: 1 core
- Max code size: 50KB
- Max test case size: 10KB

#### DockerSecurityConfig
- Creates secure HostConfig for containers
- Enforces security policies:
  - No network access
  - Limited processes (max 50)
  - CPU and memory limits
  - All Linux capabilities dropped
  - No swap memory

### 3. Service

#### CodeExecutorService
Main service for executing code in Docker containers.

**Key Methods:**

- `runInContainer(ExecutionRequest)`: Execute code with resource limits
- `createContainer(imageName, request)`: Create secure container
- `writeCodeToContainer(containerId, request)`: Copy code to container
- `executeCodeInContainer(containerId, request, startTime)`: Run code and capture output
- `collectMetrics(containerId, runtimeMs)`: Gather resource usage metrics
- `cleanupContainer(containerId)`: Remove container after execution

## Execution Flow

1. **Validation**: Validate request (code size, language, limits)
2. **Container Creation**: Create Docker container with security settings
3. **Container Start**: Start the container
4. **Code Transfer**: Write code and input files to container
5. **Execution**: Execute code with timeout enforcement
6. **Metrics Collection**: Gather runtime and memory metrics
7. **Result Processing**: Determine status (success, error, TLE, MLE)
8. **Cleanup**: Stop and remove container

## Security Features

### Container-Level Security
- Runs as non-root user (`nobody`)
- No network access (`networkMode = "none"`)
- Read-only root filesystem (except `/tmp`)
- Limited to 50 processes
- All Linux capabilities dropped
- No privileged mode

### Resource Limits
- CPU: 1 core maximum
- Memory: Configurable per problem
- Time: Configurable per problem
- Container lifetime: 30 seconds maximum

### Code Restrictions
- Maximum code size: 50KB
- Maximum test case size: 10KB
- Isolated execution (no access to host or other containers)
- Containers destroyed after each execution

## Supported Languages

### Java
- Image: `localcode-java:latest`
- Runtime: OpenJDK 17
- Execution: Compile with `javac`, run with `java`
- File: Extracts class name from code

### Python
- Image: `localcode-python:latest`
- Runtime: Python 3.11
- Execution: `python3 solution.py`
- File: `solution.py`

### JavaScript
- Image: `localcode-javascript:latest`
- Runtime: Node.js 18
- Execution: `node solution.js`
- File: `solution.js`

## Error Handling

### Compilation Errors
Detected by analyzing stderr output:
- Java: Contains "error:" but not "Exception"
- Python: Contains "SyntaxError" or "IndentationError"
- JavaScript: Contains "SyntaxError" but not "ReferenceError"

### Runtime Errors
Any non-zero exit code that's not a compilation error.

### Timeouts
- Execution timeout: Request time limit + 5 seconds buffer
- Container lifetime: 30 seconds maximum
- Stats collection: 2 seconds timeout

### Resource Limit Violations
- TLE: Runtime exceeds problem's time limit
- MLE: Memory usage exceeds problem's memory limit

## Configuration

Add to `application.properties`:

```properties
# Code Execution Resource Limits
execution.limits.default-time-limit-ms=2000
execution.limits.default-memory-limit-mb=256
execution.limits.max-container-lifetime-seconds=30
execution.limits.cpu-quota=100000
execution.limits.cpu-period=100000
execution.limits.max-code-size-kb=50
execution.limits.max-test-case-size-kb=10
```

## Usage Example

```java
@Autowired
private CodeExecutorService executorService;

public void executeUserCode() {
    ExecutionRequest request = new ExecutionRequest(
        "print('Hello, World!')",  // code
        "python",                   // language
        "",                         // input
        2000,                       // timeLimitMs
        256                         // memoryLimitMb
    );
    
    ExecutionResult result = executorService.runInContainer(request);
    
    if (result.getStatus() == ExecutionStatus.SUCCESS) {
        System.out.println("Output: " + result.getOutput());
        System.out.println("Runtime: " + result.getMetrics().getRuntimeMs() + "ms");
    } else {
        System.out.println("Error: " + result.getErrorMessage());
    }
}
```

## Building Docker Images

From the `localcode` directory:

```bash
make docker-build
```

Or manually:

```bash
cd docker
docker build -t localcode-java:latest -f Dockerfile.java .
docker build -t localcode-python:latest -f Dockerfile.python .
docker build -t localcode-javascript:latest -f Dockerfile.javascript .
```

## Testing

The images can be tested manually:

```bash
# Test Java image
docker run --rm -it localcode-java:latest bash

# Test Python image
docker run --rm -it localcode-python:latest bash

# Test JavaScript image
docker run --rm -it localcode-javascript:latest bash
```

## Future Enhancements

- Container pooling for better performance
- Pre-warming containers for common languages
- Parallel test case execution
- WebSocket support for real-time output streaming
- Additional language support (C++, Go, Rust, etc.)
- Enhanced metrics collection (CPU usage, I/O stats)
- Caching of compiled code for repeated submissions
