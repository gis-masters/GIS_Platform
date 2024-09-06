FROM openjdk:11-jre
LABEL MAINTAINER="Fanatic Fiz <fanaticfiz@outlook.com>"

COPY ./target/apm-agent.jar apm-agent.jar
COPY ./target/geo-wrapper.jar geo-wrapper.jar

RUN set -eux; \
    apt update; \
    apt install gdal-bin -y; \
    apt install zip -y; \
    apt autoremove -y; \
    apt autoclean -y;

ENV XMX_SIZE=1G

ENTRYPOINT sleep 1m && exec java -Xmx${XMX_SIZE} -javaagent:apm-agent.jar \
                                                 -Delastic.apm.service_name=crg-geo-wrapper \
                                                 -Delastic.apm.server_url=${APM_URL} \
                                                 -Delastic.apm.enable_log_correlation=true \
                                                 -Delastic.apm.application_packages=ru.mycrg.wrapper \
                                                 -Duser.timezone=Europe/Moscow \
                                                 -jar geo-wrapper.jar
