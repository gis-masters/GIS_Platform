FROM openjdk:10
MAINTAINER Fanatic Fiz <fanaticfiz@fanaticfiz.com>

COPY ./target/jwt-service.jar jwt-service.jar
EXPOSE 9000

ENTRYPOINT ["java", "-javaagent:/opt/elastic-apm-agent/elastic-apm-agent-1.6.1.jar", "-Delastic.apm.service_name=crg-jwt", "-Delastic.apm.server_url=http://10.10.10.116:8200", "-Delastic.apm.application_packages=ru.mycrg.sts", "-jar", "jwt-service.jar"]
