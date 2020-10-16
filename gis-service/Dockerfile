FROM openjdk:8-jre-alpine
LABEL MAINTAINER="Fanatic Fiz <fanaticfiz@outlook.com>" 

RUN apk --no-cache add curl

COPY ./target/apm-agent.jar apm-agent.jar

COPY ./target/gis-service.jar gis-service.jar

ENV XMX_SIZE=200m

HEALTHCHECK --interval=30s --timeout=10s --retries=6 --start-period=1m \
    CMD curl -f http://localhost:8082/actuator/health || exit 1

ENTRYPOINT exec java -Xmx${XMX_SIZE} -javaagent:apm-agent.jar \
                                     -Delastic.apm.service_name=gis-service \
                                     -Delastic.apm.server_url=${APM_URL} \
                                     -Delastic.apm.enable_log_correlation=true \
                                     -Delastic.apm.application_packages=ru.mycrg.gis_service \
                                     -jar gis-service.jar
