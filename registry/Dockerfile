FROM openjdk:10
MAINTAINER Fanatic Fiz <fanaticfiz@fanaticfiz.com>

ADD ./target/registry.jar /app/

CMD ["java", "-Xmx200m", "-javaagent:/opt/elastic-apm-agent/elastic-apm-agent-1.6.1.jar", "-Delastic.apm.service_name=crg-registry", "-Delastic.apm.server_url=http://apm-server:8200", "-Delastic.apm.application_packages=ru.mycrg.registry", "-jar", "/app/registry.jar"]

EXPOSE 8761
