FROM 10.10.10.116:5000/azul/zulu-openjdk-alpine:25-jre
LABEL MAINTAINER="Fanatic Fiz <fanaticfiz@outlook.com>"

RUN echo "http://10.10.10.116:8081/repository/alpain_proxy/v3.20/main" > /etc/apk/repositories
RUN apk --no-cache add curl

COPY ./target/apm-agent.jar apm-agent.jar

COPY ./target/notification-service.jar notification-service.jar

ENV XMX_SIZE=400m

ENTRYPOINT exec java -XX:MaxRAMPercentage=${XX_MAX_RAM_PERCENTAGE:-75.0} -javaagent:apm-agent.jar \
                                     -Delastic.apm.service_name=notification-service \
                                     -Delastic.apm.server_url=${APM_URL} \
                                     -Delastic.apm.enable_log_correlation=true \
                                     -Delastic.apm.application_packages=ru.mycrg.notification \
                                     -Duser.timezone=Europe/Moscow \
                                     -jar notification-service.jar
