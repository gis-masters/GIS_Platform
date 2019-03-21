package ru.mycrg.gis.config;

import org.jetbrains.annotations.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.Optional;

@ConfigurationProperties(prefix = "crg-options")
public class CrgProperties {

    private String gmlStoragePath;

    public CrgProperties() {}

    public void setGmlStoragePath(String gmlStoragePath) {
        this.gmlStoragePath = gmlStoragePath;
    }

    @NotNull
    public String getGmlStoragePath() {
        return Optional
                .ofNullable(gmlStoragePath)
                .orElseThrow(() -> new IllegalStateException("Not set gmlStoragePath"));
    }

}
