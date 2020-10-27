package ru.mycrg.gis_service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.camunda.bpm.spring.boot.starter.annotation.EnableProcessApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import ru.mycrg.geoserver_client.DbInfo;
import ru.mycrg.geoserver_client.GeoserverClient;
import ru.mycrg.geoserver_client.GeoserverInfo;
import ru.mycrg.gis_service.config.CrgProperties;

import java.net.MalformedURLException;

@SpringBootApplication
@EnableProcessApplication
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class GisServiceApplication {

    private static final Logger log = LoggerFactory.getLogger(GisServiceApplication.class);

    public static final ObjectMapper objectMapper = new ObjectMapper();

    private final Environment environment;
    private final CrgProperties properties;

    public GisServiceApplication(Environment environment, CrgProperties properties) {
        this.environment = environment;
        this.properties = properties;
    }

    public static void main(String[] args) {
        SpringApplication.run(GisServiceApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void initGeoserverClient() throws MalformedURLException {
        log.info("initGeoserverClient");

        GeoserverInfo geoserverInfo = GeoserverInfo.builder()
                .host(properties.getGeoserverHost().split(":")[0])
                .port(Integer.parseInt(properties.getGeoserverHost().split(":")[1]))
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

        GeoserverClient.initialize(geoserverInfo, dbInfo);
    }

}
