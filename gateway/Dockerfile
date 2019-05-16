FROM openjdk:10
MAINTAINER Fanatic Fiz <fanaticfiz@fanaticfiz.com>

COPY ./target/gateway.jar gateway.jar
EXPOSE 9000
ENTRYPOINT ["java", "-javaagent:/opt/elastic-apm-agent/elastic-apm-agent-1.6.1.jar", "-Delastic.apm.service_name=crg-gateway", "-Delastic.apm.server_url=http://10.10.10.116:8200", "-Delastic.apm.application_packages=ru.mycrg.gateway", "-jar", "gateway.jar"]
