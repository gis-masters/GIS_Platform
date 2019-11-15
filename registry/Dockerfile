FROM openjdk:8-jre-alpine
LABEL MAINTAINER="Fanatic Fiz <fanaticfiz@outlook.com>" 

COPY ./target/apm-agent.jar apm-agent.jar

COPY ./target/registry.jar registry.jar

ENV XMX_SIZE=200m

ENTRYPOINT exec java -Xmx${XMX_SIZE} -javaagent:apm-agent.jar \
                                     -Delastic.apm.service_name=crg-registry \
                                     -Delastic.apm.server_url=${APM_URL} \
                                     -Delastic.apm.application_packages=ru.mycrg.registry \
                                     -Delastic.apm.enable_log_correlation=true \
                                     -jar registry.jar
