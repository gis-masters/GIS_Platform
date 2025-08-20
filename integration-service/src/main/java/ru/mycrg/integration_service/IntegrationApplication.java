package ru.mycrg.integration_service;

import com.fasterxml.jackson.annotation.JsonInclude;
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
            .setSerializationInclusion(JsonInclude.Include.NON_NULL)
            .setDateFormat(new SimpleDateFormat("dd-MM-yyyy HH:mm"));

    private static final Logger log = LoggerFactory.getLogger(IntegrationApplication.class);
    private final CrgIntegrationProperties properties;

    public IntegrationApplication(CrgIntegrationProperties properties) {
        this.properties = properties;
    }

    public static void main(String[] args) {
        Runtime runtime = Runtime.getRuntime();
        long maxMemory = runtime.maxMemory();
        long totalMemory = runtime.totalMemory();

        log.info("=== HEAP MEMORY INFO ===");
        log.info("HEAP: Max Memory (Xmx): {} MB", maxMemory / (1024*1024));
        log.info("HEAP: Initial Memory (Xms): {} MB", totalMemory / (1024*1024));
        log.info("========= END HEAP =========");
        SpringApplication.run(IntegrationApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void initGeoserverClient() {
        log.info("initGeoserverClient");

        String geoserverHost = properties.getGeoserverHost();
        GeoserverInfo geoserverInfo = new GeoserverInfo(geoserverHost.split(":")[0],
                                                        Integer.parseInt(geoserverHost.split(":")[1]),
                                                        properties.getUserServiceName());

        // TODO: Не ходить из integration-service на прямую на геосервер.
        GeoserverClient.initialize(geoserverInfo);

        log.info("Integration service ready with:");
        log.info("geoserver-host {}", geoserverHost);
    }
}
