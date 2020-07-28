package ru.mycrg.data_service.config;

import org.jetbrains.annotations.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@ConfigurationProperties(prefix = "crg-options")
public class CrgProperties {

    private String fileStoragePath;

    @NotNull
    public String getFileStoragePath() {
        return Optional
                .ofNullable(fileStoragePath)
                .orElseThrow(() -> new IllegalStateException("Not set fileStoragePath"));
    }

    public void setFileStoragePath(String clientId) {
        this.fileStoragePath = clientId;
    }

}
