FROM openjdk:8-alpine
MAINTAINER Fanatic Fiz <fanaticfiz@outlook.com>

COPY ./target/apm-agent.jar apm-agent.jar

COPY ./target/geo-api.jar geo-api.jar

ENV XMX_SIZE=200m

ENTRYPOINT exec java -Xmx${XMX_SIZE} -javaagent:apm-agent.jar \
                                     -Delastic.apm.service_name=crg-api \
                                     -Delastic.apm.server_url=${APM_URL} \
                                     -Delastic.apm.application_packages=ru.mycrg.gis \
                                     -jar geo-api.jar
