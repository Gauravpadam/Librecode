FROM openjdk:17.0.1-jdk-slim

WORKDIR /app

RUN mkdir -p /tmp/code && chmod 777 /tmp/code

# Copy JAR (path relative to docker-compose build context which is localcode/)
COPY backend/target/*.jar app.jar

RUN apt-get update && apt-get install -y --no-install-recommends \
    time \
    && rm -rf /var/lib/apt/lists/*

USER nobody

CMD ["java", "-jar", "/app/app.jar"]
