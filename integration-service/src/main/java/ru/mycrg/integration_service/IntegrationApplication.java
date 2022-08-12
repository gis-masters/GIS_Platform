package ru.mycrg.integration_service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.camunda.bpm.spring.boot.starter.annotation.EnableProcessApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import ru.mycrg.geoserver_client.GeoserverClient;
import ru.mycrg.geoserver_client.GeoserverInfo;
import ru.mycrg.integration_service.config.CrgIntegrationProperties;

import java.text.SimpleDateFormat;

@SpringBootApplication
@EnableProcessApplication
@EnableTransactionManagement
public class IntegrationApplication {

    public static final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .setDateFormat(new SimpleDateFormat("dd-MM-yyyy HH:mm"));

    private final Logger log = LoggerFactory.getLogger(IntegrationApplication.class);
    private final CrgIntegrationProperties properties;

    public IntegrationApplication(CrgIntegrationProperties properties) {
        this.properties = properties;
    }

    public static void main(String[] args) {
        SpringApplication.run(IntegrationApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void initGeoserverClient() {
        log.info("initGeoserverClient");

        GeoserverInfo geoserverInfo = GeoserverInfo
                .builder()
                .host(properties.getGeoserverHost().split(":")[0])
                .port(Integer.parseInt(properties.getGeoserverHost().split(":")[1]))
                .userServiceName(properties.getUserServiceName())
                .build();

        GeoserverClient.initialize(geoserverInfo);
    }
}
