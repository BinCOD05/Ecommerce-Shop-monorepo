# Stage 1: Build với Maven hỗ trợ Java 25
# Lưu ý: Sử dụng Eclipse Temurin hoặc Amazon Corretto vì Docker Hub chính thức đã chuyển dịch sang các distribution này
FROM maven:3-eclipse-temurin-25 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run với JRE 25
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]