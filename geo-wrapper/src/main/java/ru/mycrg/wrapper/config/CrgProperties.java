package ru.mycrg.wrapper.config;

import org.jetbrains.annotations.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.net.URL;
import java.util.Optional;

@Component
@ConfigurationProperties(prefix = "crg-options")
public class CrgProperties {

    private URL gisServiceUrl;
    private URL dataServiceUrl;
    private String geoserverHost;
    private String userServiceName;

    private String exportStoragePath;

    public void setGisServiceUrl(URL gisServiceUrl) {
        this.gisServiceUrl = gisServiceUrl;
    }

    @NotNull
    public URL getGisServiceUrl() {
        return Optional
                .ofNullable(gisServiceUrl)
                .orElseThrow(() -> new IllegalStateException("Not set gisServiceUrl"));
    }

    public void setDataServiceUrl(URL dataServiceUrl) {
        this.dataServiceUrl = dataServiceUrl;
    }

    @NotNull
    public URL getDataServiceUrl() {
        return Optional
                .ofNullable(dataServiceUrl)
                .orElseThrow(() -> new IllegalStateException("Not set dataServiceUrl"));
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
