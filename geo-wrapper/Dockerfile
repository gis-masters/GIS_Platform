FROM 10.10.10.116:5000/openjdk:11-jre
LABEL MAINTAINER="Fanatic Fiz <fanaticfiz@outlook.com>"

COPY ./target/apm-agent.jar apm-agent.jar
COPY ./target/geo-wrapper.jar geo-wrapper.jar

RUN set -eux; \
    echo "deb http://10.10.10.116:8081/repository/debian-apt-proxy bullseye main" > /etc/apt/sources.list; \
    apt update; \
    apt install gdal-bin -y; \
    apt install zip -y; \
    apt autoremove -y; \
    apt autoclean -y;

ENTRYPOINT sleep 1m && exec java -Xmx${XMX_SIZE} -javaagent:apm-agent.jar \
                                                 -Delastic.apm.service_name=crg-geo-wrapper \
                                                 -Delastic.apm.server_url=${APM_URL} \
                                                 -Delastic.apm.enable_log_correlation=true \
                                                 -Delastic.apm.application_packages=ru.mycrg.wrapper \
                                                 -Duser.timezone=Europe/Moscow \
                                                 -jar geo-wrapper.jar
