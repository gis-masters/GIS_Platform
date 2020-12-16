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
        SpringApplication.run(GeoServerWrapperApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void initGeoserverClient() {
        log.info("initGeoserverClient");

        GeoserverInfo geoserverInfo = GeoserverInfo.builder()
                .host(properties.getGeoserverHost().split(":")[0])
                .port(Integer.parseInt(properties.getGeoserverHost().split(":")[1]))
                .userServiceName(properties.getUserServiceName())
                .build();

        GeoserverClient.initialize(geoserverInfo);
    }
}
