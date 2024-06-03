FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY target/e-library-0.0.1-SNAPSHOT.jar /app/e-library.jar

CMD ["java", "-jar", "e-library.jar"]
