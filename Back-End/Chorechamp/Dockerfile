FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Eerst pom voor caching
COPY pom.xml .
RUN mvn -q -e -DskipTests dependency:go-offline

# Dan de rest
COPY . .
RUN mvn -q -e -DskipTests clean package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
