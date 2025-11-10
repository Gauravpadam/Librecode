FROM node:18-slim

# Set working directory
WORKDIR /app

# Create temp directory for code execution
RUN mkdir -p /tmp/code && chmod 777 /tmp/code

# Set resource limits and security
USER nobody

# Default command (will be overridden during execution)
CMD ["node"]
