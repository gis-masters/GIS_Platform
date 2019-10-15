FROM 10.10.10.165:5000/zuzlu-opendjk-8:ogr-zip
MAINTAINER Fanatic Fiz <fanaticfiz@outlook.com>

COPY ./target/apm-agent.jar apm-agent.jar

COPY ./target/geo-wrapper.jar geo-wrapper.jar

ENV XMX_SIZE=1G

ENTRYPOINT exec java -Xmx${XMX_SIZE} -javaagent:apm-agent.jar \
                                     -Delastic.apm.service_name=crg-geo-wrapper \
                                     -Delastic.apm.server_url=${APM_PATH} \
                                     -Delastic.apm.application_packages=ru.mycrg.wrapper \
                                     -jar geo-wrapper.jar
