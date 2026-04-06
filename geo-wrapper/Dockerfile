FROM 10.10.10.116:5000/azul/zulu-openjdk-alpine:25-jre
LABEL MAINTAINER="Fanatic Fiz <fanaticfiz@outlook.com>"

COPY ./target/apm-agent.jar apm-agent.jar
COPY ./target/geo-wrapper.jar geo-wrapper.jar

RUN set -eux; \
    printf '%s\n%s\n' \
        "http://10.10.10.116:8081/repository/alpain_proxy/v3.20/main" \
        "http://10.10.10.116:8081/repository/alpain_proxy/v3.20/community" \
        > /etc/apk/repositories; \
    apk --no-cache add \
        gdal \
        gdal-tools \
        gdal-driver-png \
        gdal-driver-pg \
        zip

ENTRYPOINT sleep 1m && exec java -Xmx${XMX_SIZE} -javaagent:apm-agent.jar \
                                                 -Delastic.apm.service_name=crg-geo-wrapper \
                                                 -Delastic.apm.server_url=${APM_URL} \
                                                 -Delastic.apm.enable_log_correlation=true \
                                                 -Delastic.apm.application_packages=ru.mycrg.wrapper \
                                                 -Duser.timezone=Europe/Moscow \
                                                 -jar geo-wrapper.jar
