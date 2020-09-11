FROM azul/zulu-openjdk-alpine:11-jre
LABEL MAINTAINER="Fanatic Fiz <fanaticfiz@outlook.com>" 

COPY ./target/apm-agent.jar apm-agent.jar

COPY ./target/integration-service.jar integration-service.jar

ENV XMX_SIZE=200m

ENTRYPOINT exec java -Xmx${XMX_SIZE} -javaagent:apm-agent.jar \
                                     -Delastic.apm.service_name=integration-service \
                                     -Delastic.apm.server_url=${APM_URL} \
                                     -Delastic.apm.enable_log_correlation=true \
                                     -Delastic.apm.application_packages=ru.mycrg.integration-service \
                                     -jar integration-service.jar
