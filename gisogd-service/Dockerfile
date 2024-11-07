FROM 10.10.10.116:5000/azul/zulu-openjdk-alpine:11-jre
LABEL MAINTAINER="Fanatic Fiz <fanaticfiz@outlook.com>"

RUN echo "http://10.10.10.116:8081/repository/alpain_proxy/v3.20/main" > /etc/apk/repositories
RUN apk --no-cache add curl

COPY ./target/apm-agent.jar apm-agent.jar

COPY ./target/gisogd-service.jar gisogd-service.jar

COPY ./src/main/resources/cacerts /usr/lib/jvm/java-11-zulu11/jre/lib/security/

ENV XMX_SIZE=1111m

ENTRYPOINT exec java -Xmx${XMX_SIZE} -javaagent:apm-agent.jar \
                                     -Delastic.apm.service_name=gisogd-service \
                                     -Delastic.apm.server_urls=${APM_URL} \
                                     -Delastic.apm.enable_log_correlation=true \
                                     -Delastic.apm.application_packages=ru.mycrg.gisogd_service \
                                     -Duser.timezone=Europe/Moscow \
                                     -jar gisogd-service.jar
