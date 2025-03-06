package ru.mycrg.gis_service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.camunda.bpm.spring.boot.starter.annotation.EnableProcessApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import ru.mycrg.geoserver_client.GeoserverClient;
import ru.mycrg.geoserver_client.GeoserverInfo;
import ru.mycrg.gis_service.config.CrgProperties;
import ru.mycrg.http_client.config.RetryConfig;

@SpringBootApplication
@EnableProcessApplication
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class GisServiceApplication {

    public static final ObjectMapper objectMapper = new ObjectMapper();

    private static final Logger log = LoggerFactory.getLogger(GisServiceApplication.class);

    private final CrgProperties properties;

    public GisServiceApplication(CrgProperties properties) {
        this.properties = properties;
    }

    public static void main(String[] args) {
        Runtime runtime = Runtime.getRuntime();
        long maxMemory = runtime.maxMemory();
        long totalMemory = runtime.totalMemory();

        log.info("=== HEAP MEMORY INFO ===");
        log.info("HEAP: Max Memory (Xmx): {} MB", maxMemory / (1024 * 1024));
        log.info("HEAP: Initial Memory (Xms): {} MB", totalMemory / (1024 * 1024));
        log.info("========= END HEAP =========");
        SpringApplication.run(GisServiceApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void initGeoserverClient() {
        log.info("initGeoserverClient");

        String[] split = properties.getGeoserverHost().split(":");
        GeoserverInfo geoserverInfo = new GeoserverInfo(split[0],
                                                        Integer.parseInt(split[1]),
                                                        properties.getUserServiceName());

        GeoserverClient.initialize(geoserverInfo,
                                   RetryConfig.builder().maxAttempts(2).waitDuration(180_000L).build()
        );
    }
}
