package ru.mycrg.gis_service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import ru.mycrg.geoserver_client.AuthServiceInfo;
import ru.mycrg.geoserver_client.DbInfo;
import ru.mycrg.geoserver_client.GeoserverClient;
import ru.mycrg.geoserver_client.GeoserverInfo;
import ru.mycrg.gis_service.config.CrgProperties;

@SpringBootApplication
public class GisServiceApplication {

    private static final Logger log = LoggerFactory.getLogger(GisServiceApplication.class);

    @Autowired
    private Environment environment;

    @Autowired
    private CrgProperties properties;

    public static void main(String[] args) {
        SpringApplication.run(GisServiceApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void initGeoserverClient() {
        log.info("initGeoserverClient");

        AuthServiceInfo authServiceInfo = AuthServiceInfo.builder()
                .url(properties.getAuthServiceUrl())
                .clientId(properties.getClientId())
                .clientSecret(properties.getClientSecret())
                .build();

        GeoserverInfo geoserverInfo = GeoserverInfo.builder()
                .host(properties.getGeoserverHost().split(":")[0])
                .port(Integer.parseInt(properties.getGeoserverHost().split(":")[1]))
                .rootUserName(properties.getRootUserName())
                .rootUserPassword(properties.getRootUserPassword())
                .userServiceName(properties.getUserServiceName())
                .build();


        String postGis = environment.getRequiredProperty("spring.datasource.url")
                .split("//")[1]
                .split("/")[0];

        DbInfo dbInfo = DbInfo.builder()
                .dbHost(postGis.split(":")[0])
                .dbPort(Integer.parseInt(postGis.split(":")[1]))
                .dbOwnerUser(environment.getRequiredProperty("spring.datasource.username"))
                .dbOwnerPassword(environment.getRequiredProperty("spring.datasource.password"))
                .build();

        GeoserverClient.initialize(authServiceInfo, geoserverInfo, dbInfo);
    }

}
