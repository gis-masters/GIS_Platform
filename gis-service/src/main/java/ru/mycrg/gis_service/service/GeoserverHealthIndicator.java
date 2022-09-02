package ru.mycrg.gis_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;
import ru.mycrg.geoserver_client.services.resources.Version;
import ru.mycrg.gis_service.security.CrgAuthHandler;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

@Component
public class GeoserverHealthIndicator implements HealthIndicator {

    private final Logger log = LoggerFactory.getLogger(GeoserverHealthIndicator.class);

    private final CrgAuthHandler crgAuthHandler;

    public GeoserverHealthIndicator(CrgAuthHandler crgAuthHandler) {

        this.crgAuthHandler = crgAuthHandler;
    }

    @Override
    public Health health() {
        try {
            String accessToken = crgAuthHandler.getRootAccessToken();

            ResponseModel<Object> response = new Version(accessToken).getMigrationVersion();
            if (response.isSuccessful()) {
                return Health.up().build();
            } else {
                log.warn("Geoserver not healthy: {} / {}", response.getCode(), response.getMsg());

                return Health.down().build();
            }
        } catch (HttpClientException e) {
            log.warn("Geoserver not accessible");

            return Health.down().build();
        }
    }
}
