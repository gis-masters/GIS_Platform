package ru.mycrg.gis_service.config;

import org.jetbrains.annotations.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@ConfigurationProperties(prefix = "crg-options")
public class CrgProperties {

    private String geoserverHost;
    private String userServiceName;

    @NotNull
    public String getGeoserverHost() {
        return Optional
                .ofNullable(geoserverHost)
                .orElseThrow(() -> new IllegalStateException("Not set getGeoserverHost"));
    }

    public void setGeoserverHost(String geoserverHost) {
        this.geoserverHost = geoserverHost;
    }

    public void setUserServiceName(String userServiceName) {
        this.userServiceName = userServiceName;
    }

    public String getUserServiceName() {
        return userServiceName;
    }
}
