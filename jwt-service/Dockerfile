FROM openjdk:10
MAINTAINER Fanatic Fiz <fanaticfiz@fanaticfiz.com>

COPY ./target/jwt-service.jar jwt-service.jar
EXPOSE 9000
ENTRYPOINT ["java", "-jar", "jwt-service.jar"]
