# LocalCode Runtimes

Docker images for running user-submitted code safely.

## The problem

When users submit code, we need to run it. But running arbitrary code is dangerous — someone could try to delete files, mine crypto, or do other nasty things.

The solution: run each submission in a fresh, isolated Docker container with strict limits. No network access, limited CPU and memory, read-only filesystem. The container runs the code, captures the output, and gets destroyed.

## Available runtimes

| Dockerfile | Language | Version |
|------------|----------|---------|
| `Dockerfile.java` | Java | 17 |
| `Dockerfile.python` | Python | 3.11 |
| `Dockerfile.javascript` | Node.js | 18 |

## Building the images

From the project root:

```bash
make runtime-build
```

Or manually:

```bash
docker build -t localcode-java:latest -f runtimes/Dockerfile.java .
docker build -t localcode-python:latest -f runtimes/Dockerfile.python .
docker build -t localcode-javascript:latest -f runtimes/Dockerfile.javascript .
```

## How execution works

When the backend receives a submission:

1. It creates a container from the appropriate image
2. Copies the user's code and test input to `/tmp/code` inside the container
3. Runs the code with a timeout
4. Captures stdout, stderr, and resource usage
5. Destroys the container

Each execution is completely isolated. Nothing persists between runs.

## Security measures

These containers are locked down:

**No network**
- Network mode is set to `none`
- Code can't make HTTP requests or connect to anything

**No privileges**
- Runs as `nobody` user
- All Linux capabilities dropped
- Can't escalate privileges

**Limited resources**
- CPU: 1 core max
- Memory: 256MB default (configurable per problem)
- Time: 2 seconds default (configurable per problem)
- Max 50 processes

**Restricted filesystem**
- Root filesystem is read-only
- Only `/tmp` is writable (for the code)
- No access to host filesystem

**Short-lived**
- Containers are destroyed after 30 seconds max
- No data persists

## Resource limits

The backend enforces these limits (configurable in `application.properties`):

| Resource | Default | Max |
|----------|---------|-----|
| Time | 2 seconds | 5 seconds |
| Memory | 256 MB | 256 MB |
| Code size | 50 KB | 50 KB |
| Test case size | 10 KB | 10 KB |
| Container lifetime | 30 seconds | 30 seconds |

Problems can have custom time limits (Easy: 2s, Medium: 3s, Hard: 5s).

## Testing an image

You can poke around inside a container:

```bash
docker run --rm -it localcode-java:latest bash
docker run --rm -it localcode-python:latest bash
docker run --rm -it localcode-javascript:latest bash
```

Note: You'll be the `nobody` user with limited permissions. That's intentional.

## Adding a new language

To add support for a new language:

1. Create a new Dockerfile in this directory (e.g., `Dockerfile.rust`)
2. Install the language runtime
3. Set up a non-root user
4. Update the backend's `CodeExecutorService` to handle the new language
5. Add starter code templates in the `DataSeeder`

The Dockerfile should follow the same pattern as the existing ones — minimal base image, non-root user, no unnecessary tools.

## Why Docker and not something else?

Docker gives us:
- Process isolation
- Resource limits (cgroups)
- Network isolation
- Filesystem isolation
- Easy cleanup

We could use other sandboxing approaches (seccomp, gVisor, Firecracker), but Docker is simple, well-understood, and good enough for a self-hosted practice platform.

For a production system handling untrusted code at scale, you'd want additional layers of isolation.
