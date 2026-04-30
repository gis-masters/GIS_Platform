FROM 10.10.10.116:5000/azul/zulu-openjdk:25-jre
LABEL MAINTAINER="Fanatic Fiz <fanaticfiz@outlook.com>"

RUN set -eux; \
    grep -RIl 'repos.azul.com/zulu' /etc/apt/sources.list /etc/apt/sources.list.d 2>/dev/null | xargs -r rm -f; \
    apt-get update; \
    apt-get install -y --no-install-recommends curl; \
    apt-get clean; \
    rm -rf /var/lib/apt/lists/*

ADD assets/dist/linux-amd64_deb.tgz /tmp
COPY assets/test /opt/test
COPY ./target/apm-agent.jar apm-agent.jar
COPY ./target/crypt-service.jar crypt-service.jar

RUN set -eux; \
    /tmp/linux-amd64_deb/install.sh; \
    ln -s /opt/cprocsp/bin/amd64/certmgr /opt/certmgr; \
    ln -s /opt/cprocsp/bin/amd64/cpverify /opt/cpverify; \
    ln -s /opt/cprocsp/bin/amd64/cryptcp /opt/cryptcp; \
    ln -s /opt/cprocsp/sbin/amd64/cpconfig /opt/cpconfig; \
    rm -rf /tmp/*

# Проверяем работоспособность проверив отсоединённую подпись тестового файла
HEALTHCHECK --interval=30s --timeout=30s --retries=3 \
    CMD ./opt/cryptcp -verify -nochain -verall -fext .sig -detached /opt/test/signed.dxf || exit 1

ENV XMX_SIZE=400m

ENTRYPOINT exec java -Xmx${XMX_SIZE} -javaagent:apm-agent.jar \
                                     -Delastic.apm.service_name=cryptopro-service \
                                     -Delastic.apm.server_url=${APM_URL} \
                                     -Delastic.apm.enable_log_correlation=true \
                                     -Delastic.apm.application_packages=ru.mycrg.cryptopro \
                                     -Duser.timezone=Europe/Moscow \
                                     -jar crypt-service.jar
