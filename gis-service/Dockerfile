FROM 10.10.10.116:5000/azul/zulu-openjdk-alpine:11-jre
LABEL MAINTAINER="Fanatic Fiz <fanaticfiz@outlook.com>" 

RUN echo "http://10.10.10.116:8081/repository/alpain_proxy/v3.20/main" > /etc/apk/repositories
RUN apk --no-cache add curl

COPY ./target/apm-agent.jar apm-agent.jar

COPY ./target/gis-service.jar gis-service.jar

HEALTHCHECK --interval=15s --timeout=3s --retries=3 --start-period=2m \
    CMD curl -f http://localhost:8082/actuator/health || exit 1

ENTRYPOINT exec java -Xmx${XMX_SIZE} -javaagent:apm-agent.jar \
                                     -Delastic.apm.service_name=gis-service \
                                     -Delastic.apm.server_url=${APM_URL} \
                                     -Delastic.apm.enable_log_correlation=true \
                                     -Delastic.apm.application_packages=ru.mycrg.gis_service \
                                     -Duser.timezone=Europe/Moscow \
                                     -jar gis-service.jar
