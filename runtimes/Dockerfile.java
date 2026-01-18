FROM openjdk:17.0.1-jdk-slim

WORKDIR /app

RUN mkdir -p /tmp/code && chmod 777 /tmp/code

RUN apt-get update && apt-get install -y --no-install-recommends \
    time \
    && rm -rf /var/lib/apt/lists/*

CMD ["java"]