FROM 10.10.10.116:5000/azul/zulu-openjdk-alpine:25-jre

LABEL MAINTAINER="ionov_java <v.ionov@mycrg.ru>"

COPY ./target/report-service.jar report-service.jar

COPY ./target/apm-agent.jar apm-agent.jar

COPY src/main/resources/system_templates report-service/src/main/resources/system_templates

ENTRYPOINT exec java -Xmx${XMX_SIZE} \
                                     --add-opens java.base/java.lang=ALL-UNNAMED \
                                     --add-opens java.base/java.lang.reflect=ALL-UNNAMED \
                                     --add-opens java.base/java.io=ALL-UNNAMED \
                                     --add-opens java.base/java.util=ALL-UNNAMED \
                                     -javaagent:apm-agent.jar \
                                     -Delastic.apm.service_name=report-service \
                                     -Delastic.apm.server_url=${APM_URL} \
                                     -Delastic.apm.enable_log_correlation=true \
                                     -Delastic.apm.application_packages=ru.mycrg.report_service \
                                     -Duser.timezone=Europe/Moscow \
                                     -jar report-service.jar
