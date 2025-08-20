FROM 10.10.10.116:5000/azul/zulu-openjdk-alpine:11-jre
LABEL MAINTAINER="Fanatic Fiz <fanaticfiz@outlook.com>" 

RUN echo "http://10.10.10.116:8081/repository/alpain_proxy/v3.20/main" > /etc/apk/repositories
RUN apk --no-cache add curl

COPY ./target/apm-agent.jar apm-agent.jar

COPY ./target/auth-service.jar auth-service.jar

HEALTHCHECK --interval=30s --timeout=10s --retries=6 --start-period=1m \
    CMD curl -f http://localhost:9000/actuator/health || exit 1

ENTRYPOINT exec java -Xmx${XMX_SIZE} -javaagent:apm-agent.jar \
                                     -Delastic.apm.service_name=auth-service \
                                     -Delastic.apm.server_url=${APM_URL} \
                                     -Delastic.apm.enable_log_correlation=true \
                                     -Delastic.apm.application_packages=ru.mycrg.auth_service \
                                     -Duser.timezone=Europe/Moscow \
                                     -jar auth-service.jar
