FROM openjdk:10
MAINTAINER Fanatic Fiz <fanaticfiz@fanaticfiz.com>

COPY ./target/gateway.jar gateway.jar
EXPOSE 9000
ENTRYPOINT ["java", "-jar", "gateway.jar"]
