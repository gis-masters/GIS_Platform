FROM 10.10.10.116:5000/azul/zulu-openjdk-alpine:25-jre

WORKDIR /opt/hash-generator

COPY target/app.jar app.jar

ENTRYPOINT ["java", "-jar", "/opt/hash-generator/app.jar"]
