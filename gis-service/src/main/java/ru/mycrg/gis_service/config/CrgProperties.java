package ru.mycrg.gis_service.config;

import org.jetbrains.annotations.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.net.URL;
import java.util.Optional;

@Component
@ConfigurationProperties(prefix = "crg-options")
public class CrgProperties {

    private String clientId;
    private String clientSecret;

    private String rootUserName;
    private String rootUserPassword;

    private URL authServiceUrl;
    private String geoserverHost;
    private String userServiceName;

    @NotNull
    public URL getAuthServiceUrl() {
        return Optional
                .ofNullable(authServiceUrl)
                .orElseThrow(() -> new IllegalStateException("Not set authServiceUrl"));
    }

    public void setAuthServiceUrl(URL authServiceUrl) {
        this.authServiceUrl = authServiceUrl;
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
    public String getRootUserName() {
        return Optional
                .ofNullable(rootUserName)
                .orElseThrow(() -> new IllegalStateException("Not set dbOwnerUser"));
    }

    public void setRootUserName(String rootUserName) {
        this.rootUserName = rootUserName;
    }

    @NotNull
    public String getRootUserPassword() {
        return Optional
                .ofNullable(rootUserPassword)
                .orElseThrow(() -> new IllegalStateException("Not set dbOwnerPassword"));
    }

    public void setRootUserPassword(String rootUserPassword) {
        this.rootUserPassword = rootUserPassword;
    }

    public void setUserServiceName(String userServiceName) {
        this.userServiceName = userServiceName;
    }

    public String getUserServiceName() {
        return userServiceName;
    }
}
