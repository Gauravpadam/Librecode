FROM openjdk:17.0.1-jdk-slim

# Set working directory
WORKDIR /app

# Create temp directory for code execution
RUN mkdir -p /tmp/code && chmod 777 /tmp/code

# Install basic utilities
RUN apt-get update && apt-get install -y --no-install-recommends \
    time \
    && rm -rf /var/lib/apt/lists/*

# Set resource limits and security
USER nobody

# Default command (will be overridden during execution)
CMD ["java"]
