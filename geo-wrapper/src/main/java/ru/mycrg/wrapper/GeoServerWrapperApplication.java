package ru.mycrg.wrapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import ru.mycrg.geoserver_client.GeoserverClient;
import ru.mycrg.geoserver_client.GeoserverInfo;
import ru.mycrg.wrapper.config.CrgProperties;

@SpringBootApplication
@EnableTransactionManagement
public class GeoServerWrapperApplication {

    private static final Logger log = LoggerFactory.getLogger(GeoServerWrapperApplication.class);

    @Autowired
    private CrgProperties properties;

    public static void main(String[] args) {
        Runtime runtime = Runtime.getRuntime();
        long maxMemory = runtime.maxMemory();
        long totalMemory = runtime.totalMemory();

        log.info("=== HEAP MEMORY INFO ===");
        log.info("HEAP: Max Memory (Xmx): {} MB", maxMemory / (1024*1024));
        log.info("HEAP: Initial Memory (Xms): {} MB", totalMemory / (1024*1024));
        log.info("========= END HEAP =========");
        SpringApplication.run(GeoServerWrapperApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void initGeoserverClient() {
        log.info("initGeoserverClient");

        String[] split = properties.getGeoserverHost().split(":");
        GeoserverInfo geoserverInfo = new GeoserverInfo(split[0],
                                                        Integer.parseInt(split[1]),
                                                        properties.getUserServiceName());

        GeoserverClient.initialize(geoserverInfo);
    }
}
