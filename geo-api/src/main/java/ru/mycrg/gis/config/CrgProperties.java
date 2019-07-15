package ru.mycrg.gis.config;

import org.jetbrains.annotations.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.Optional;

@ConfigurationProperties(prefix = "crg-options")
public class CrgProperties {

    private String exportStoragePath;

    public CrgProperties() {}

    public void setExportStoragePath(String exportStoragePath) {
        this.exportStoragePath = exportStoragePath;
    }

    @NotNull
    public String getExportStoragePath() {
        return Optional
                .ofNullable(exportStoragePath)
                .orElseThrow(() -> new IllegalStateException("Not set exportStoragePath"));
    }

}
