FROM 10.10.10.165:5000/zuzlu-opendjk-8:ogr-zip
MAINTAINER Fanatic Fiz <fanaticfiz@fanaticfiz.com>

COPY ./target/geo-wrapper.jar geo-wrapper.jar

ENTRYPOINT ["java", "-javaagent:/opt/elastic-apm-agent/elastic-apm-agent-1.6.1.jar", "-Delastic.apm.service_name=crg-geo-wrapper", "-Delastic.apm.server_url=http://10.10.10.116:8200", "-Delastic.apm.application_packages=ru.mycrg.wrapper", "-jar", "geo-wrapper.jar"]
