FROM 10.10.10.116:5000/azul/zulu-openjdk-alpine:25-jre

LABEL MAINTAINER="ionov_java <v.ionov@mycrg.ru>"

RUN echo "http://10.10.10.116:8081/repository/alpain_proxy/v3.20/main" > /etc/apk/repositories
RUN apk --no-cache add curl

COPY ./target/report-service.jar report-service.jar

COPY ./target/apm-agent.jar apm-agent.jar

COPY src/main/resources/system_templates report-service/src/main/resources/system_templates

HEALTHCHECK --interval=30s --timeout=10s --retries=6 --start-period=10s \
    CMD curl -f http://localhost:8090/actuator/health || exit 1

ENTRYPOINT exec java -Xmx${XMX_SIZE} \
                                     -javaagent:apm-agent.jar \
                                     -Delastic.apm.service_name=report-service \
                                     -Delastic.apm.server_url=${APM_URL} \
                                     -Delastic.apm.enable_log_correlation=true \
                                     -Delastic.apm.application_packages=ru.mycrg.report_service \
                                     -Duser.timezone=Europe/Moscow \
                                     -jar report-service.jar
