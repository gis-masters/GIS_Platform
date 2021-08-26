package ru.mycrg.gis_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import ru.mycrg.geoserver_client.services.resources.Version;
import ru.mycrg.gis_service.exceptions.GisServiceException;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.oauth_client.OAuthClient;

@Component
public class GeoserverHealthIndicator implements HealthIndicator {

    private static final Logger log = LoggerFactory.getLogger(GeoserverHealthIndicator.class);

    private final Environment environment;
    private final OAuthClient oAuthClient;

    public GeoserverHealthIndicator(OAuthClient oAuthClient,
                                    Environment environment) {
        this.environment = environment;
        this.oAuthClient = oAuthClient;
    }

    @Override
    public Health health() {
        String rootUserName = environment.getRequiredProperty("crg-options.root-user-name");
        String rootUserPass = environment.getRequiredProperty("crg-options.root-user-password");

        String accessToken;
        try {
            accessToken = oAuthClient.getToken(rootUserName, rootUserPass)
                                     .getAccess_token();
        } catch (HttpClientException e) {
            throw new GisServiceException("Error get root token: " + e.getMessage());
        }

        try {
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
