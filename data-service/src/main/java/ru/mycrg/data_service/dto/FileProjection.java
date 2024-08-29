package ru.mycrg.data_service.dto;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.data_service.entity.File;

import java.time.LocalDateTime;
import java.util.UUID;

public class FileProjection {

    private final UUID id;
    private final String title;
    private final Long size;
    private final String extension;
    private final String path;
    private final String contentType;
    private final String intents;
    private final String resourceType;
    private final JsonNode resourceQualifier;
    private final String createdBy;
    private final LocalDateTime createdAt;

    private final boolean signed;
    private final boolean expired;

    public FileProjection(File file) {
        this.id = file.getId();
        this.title = file.getTitle();
        this.size = file.getSize();
        this.extension = file.getExtension();
        this.contentType = file.getContentType();
        this.intents = file.getIntents();
        this.resourceType = file.getResourceType();
        this.resourceQualifier = file.getResourceQualifier();
        this.path = file.getPath();
        this.createdBy = file.getCreatedBy();
        this.createdAt = file.getCreatedAt();

        this.signed = file.getEcp() != null && file.getEcp().length > 0;
        this.expired = false;
    }

    public UUID getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public Long getSize() {
        return size;
    }

    public String getExtension() {
        return extension;
    }

    public String getPath() {
        return path;
    }

    public String getContentType() {
        return contentType;
    }

    public String getIntents() {
        return intents;
    }

    public String getResourceType() {
        return resourceType;
    }

    public JsonNode getResourceQualifier() {
        return resourceQualifier;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public boolean isSigned() {
        return signed;
    }

    public boolean isExpired() {
        return expired;
    }
}
