FROM azul/zulu-openjdk-alpine:8-jre
LABEL MAINTAINER="Fanatic Fiz <fanaticfiz@outlook.com>"

COPY ./target/apm-agent.jar apm-agent.jar

RUN apk update && apk add zip
RUN apk add \
      --no-cache \
      --repository http://dl-cdn.alpinelinux.org/alpine/edge/testing \
      --repository http://dl-cdn.alpinelinux.org/alpine/edge/main \
      gdal

COPY ./target/geo-wrapper.jar geo-wrapper.jar

ENV XMX_SIZE=1G

ENTRYPOINT exec java -Xmx${XMX_SIZE} -javaagent:apm-agent.jar \
                                     -Delastic.apm.service_name=crg-geo-wrapper \
                                     -Delastic.apm.server_url=${APM_URL} \
                                     -Delastic.apm.enable_log_correlation=true \
                                     -Delastic.apm.application_packages=ru.mycrg.wrapper \
                                     -jar geo-wrapper.jar
