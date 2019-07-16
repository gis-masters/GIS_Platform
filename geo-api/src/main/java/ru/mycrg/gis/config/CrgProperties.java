package ru.mycrg.gis.config;

import org.jetbrains.annotations.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.Optional;

@ConfigurationProperties(prefix = "crg-options")
public class CrgProperties {

    private String exportStoragePath;
    private String gisDbUrl;
    private String gisDbUser;
    private String gisDbPassword;

    public CrgProperties() {}

    public void setExportStoragePath(String exportStoragePath) {
        this.exportStoragePath = exportStoragePath;
    }

    public void setGisDbUrl(String gisDbUrl) {
        this.gisDbUrl = gisDbUrl;
    }

    public void setGisDbUser(String gisDbUser) {
        this.gisDbUser = gisDbUser;
    }

    public void setGisDbPassword(String gisDbPassword) {
        this.gisDbPassword = gisDbPassword;
    }

    @NotNull
    public String getExportStoragePath() {
        return Optional
                .ofNullable(exportStoragePath)
                .orElseThrow(() -> new IllegalStateException("Not set exportStoragePath"));
    }

    public String getGisDbUrl() {
        return Optional
                .ofNullable(gisDbUrl)
                .orElseThrow(() -> new IllegalStateException("Not set gisDbUrl"));
    }

    public String getGisDbUser() {
        return Optional
                .ofNullable(gisDbUser)
                .orElseThrow(() -> new IllegalStateException("Not set gisDbUser"));
    }

    public String getGisDbPassword() {
        return Optional
                .ofNullable(gisDbPassword)
                .orElseThrow(() -> new IllegalStateException("Not set gisDbPassword"));
    }
}
