FROM azul/zulu-openjdk-alpine:11-jre
LABEL MAINTAINER="Fanatic Fiz <fanaticfiz@outlook.com>"

COPY ./target/apm-agent.jar apm-agent.jar
COPY ./target/geo-wrapper.jar geo-wrapper.jar

#https://pkgs.alpinelinux.org/packages?name=gdal&branch=edge
# В ветках 'edge' и 'latest-stable' ogr2ogr то ли сломан, то ли фиг его знает, на 'ogrinfo --version' не реагирует
# Это версии GDAL: '3.1.0-r1' and '3.1.0-r2'
# А версия 'gdal-3.0.3-r0' от 22-Jan-2020 которая в ветке 'v3.11' рабочая
RUN apk update && apk add zip && apk add \
      --no-cache \
      --repository http://dl-cdn.alpinelinux.org/alpine/v3.11/community \
      --repository http://dl-cdn.alpinelinux.org/alpine/v3.11/main \
      gdal

ENV XMX_SIZE=1G

ENTRYPOINT sleep 1m && exec java -Xmx${XMX_SIZE} -javaagent:apm-agent.jar \
                                                 -Delastic.apm.service_name=crg-geo-wrapper \
                                                 -Delastic.apm.server_url=${APM_URL} \
                                                 -Delastic.apm.enable_log_correlation=true \
                                                 -Delastic.apm.application_packages=ru.mycrg.wrapper \
                                                 -jar geo-wrapper.jar
