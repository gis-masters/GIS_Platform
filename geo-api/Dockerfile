FROM openjdk:10
MAINTAINER Fanatic Fiz <fanaticfiz@fanaticfiz.com>

COPY ./target/geo-api.jar geo-api.jar
EXPOSE 8088
ENTRYPOINT ["java", "-javaagent:/opt/elastic-apm-agent/elastic-apm-agent-1.6.1.jar", "-Delastic.apm.service_name=crg-api", "-Delastic.apm.server_url=http://10.10.10.116:8200", "-Delastic.apm.application_packages=ru.mycrg.gis", "-jar", "geo-api.jar"]
