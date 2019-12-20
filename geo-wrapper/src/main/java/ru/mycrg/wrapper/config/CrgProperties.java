package ru.mycrg.wrapper.config;

import org.jetbrains.annotations.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@ConfigurationProperties(prefix = "crg-options")
public class CrgProperties {

    private String authServiceHost;
    private String clientId;
    private String clientSecret;

    private String geoserverHost;
    private String geoserverUser;
    private String geoserverPassword;

    private String exportStoragePath;
    private String userServiceName;

    @NotNull
    public String getAuthServiceHost() {
        return Optional
                .ofNullable(authServiceHost)
                .orElseThrow(() -> new IllegalStateException("Not set authServiceHost"));
    }

    public void setAuthServiceHost(String authHost) {
        this.authServiceHost = authHost;
    }

    @NotNull
    public String getClientId() {
        return Optional
                .ofNullable(clientId)
                .orElseThrow(() -> new IllegalStateException("Not set clientId"));
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    @NotNull
    public String getClientSecret() {
        return Optional
                .ofNullable(clientSecret)
                .orElseThrow(() -> new IllegalStateException("Not set clientSecret"));
    }

    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }

    @NotNull
    public String getGeoserverHost() {
        return Optional
                .ofNullable(geoserverHost)
                .orElseThrow(() -> new IllegalStateException("Not set getGeoserverHost"));
    }

    public void setGeoserverHost(String geoserverHost) {
        this.geoserverHost = geoserverHost;
    }

    @NotNull
    public String getGeoserverUser() {
        return Optional
                .ofNullable(geoserverUser)
                .orElseThrow(() -> new IllegalStateException("Not set dbOwnerUser"));
    }

    public void setGeoserverUser(String geoserverUser) {
        this.geoserverUser = geoserverUser;
    }

    @NotNull
    public String getGeoserverPassword() {
        return Optional
                .ofNullable(geoserverPassword)
                .orElseThrow(() -> new IllegalStateException("Not set dbOwnerPassword"));
    }

    public void setGeoserverPassword(String geoserverPassword) {
        this.geoserverPassword = geoserverPassword;
    }

    public void setExportStoragePath(String exportStoragePath) {
        this.exportStoragePath = exportStoragePath;
    }

    @NotNull
    public String getExportStoragePath() {
        return Optional
                .ofNullable(exportStoragePath)
                .orElseThrow(() -> new IllegalStateException("Not set exportStoragePath"));
    }

    public void setUserServiceName(String userServiceName) {
        this.userServiceName = userServiceName;
    }

    public String getUserServiceName() {
        return userServiceName;
    }
}
