FROM openjdk:8-jre-alpine
LABEL MAINTAINER="Fanatic Fiz <fanaticfiz@outlook.com>" 

COPY ./target/apm-agent.jar apm-agent.jar

COPY ./target/gateway.jar gateway.jar

ENV XMX_SIZE=200m

ENTRYPOINT exec java -Xmx${XMX_SIZE} -javaagent:apm-agent.jar \
                                     -Delastic.apm.service_name=crg-gateway \
                                     -Delastic.apm.server_url=${APM_URL} \
                                     -Delastic.apm.enable_log_correlation=true \
                                     -Delastic.apm.application_packages=ru.mycrg.gateway \
                                     -jar gateway.jar
