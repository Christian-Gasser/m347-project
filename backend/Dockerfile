FROM gradle:jdk23 AS builder
LABEL maintainer="Christian Gasser"

WORKDIR /app
COPY . .
RUN gradle build --no-daemon

FROM openjdk:23-jdk

WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]