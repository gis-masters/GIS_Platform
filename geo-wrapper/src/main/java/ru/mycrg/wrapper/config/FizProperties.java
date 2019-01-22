package ru.mycrg.wrapper.config;

import org.jetbrains.annotations.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Optional;

// TODO: При следующем удобном случае поменять префикс

@Component
@ConfigurationProperties(prefix="fiz")
public class FizProperties {

    private String geoserverHost;
    private String geoserverUser;
    private String geoserverPassword;
    private String postgisHost;

    public FizProperties() {}

    @NotNull
    public String getGeoserverHost() {
        return Optional.ofNullable(geoserverHost).orElseThrow(() -> new IllegalStateException("Not set getGeoserverHost"));
    }

    public void setGeoserverHost(String geoserverHost) {
        this.geoserverHost = geoserverHost;
    }

    @NotNull
    public String getPostgisHost() {
        return Optional.ofNullable(postgisHost).orElseThrow(() -> new IllegalStateException("Not set postgisHost"));
    }

    public void setPostgisHost(String postgisHost) {
        this.postgisHost = postgisHost;
    }

    @NotNull
    public String getGeoserverUser() {
        return Optional.ofNullable(geoserverUser).orElseThrow(() -> new IllegalStateException("Not set dbOwnerUser"));
    }

    public void setGeoserverUser(String geoserverUser) {
        this.geoserverUser = geoserverUser;
    }

    @NotNull
    public String getGeoserverPassword() {
        return Optional.ofNullable(geoserverPassword).orElseThrow(() -> new IllegalStateException("Not set dbOwnerPassword"));
    }

    public void setGeoserverPassword(String geoserverPassword) {
        this.geoserverPassword = geoserverPassword;
    }
}
