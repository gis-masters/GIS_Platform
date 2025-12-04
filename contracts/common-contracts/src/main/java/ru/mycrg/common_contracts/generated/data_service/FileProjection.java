package ru.mycrg.common_contracts.generated.data_service;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;

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

    @JsonCreator
    public FileProjection(@JsonProperty("id") UUID id,
                          @JsonProperty("title") String title,
                          @JsonProperty("size") Long size,
                          @JsonProperty("extension") String extension,
                          @JsonProperty("path") String path,
                          @JsonProperty("contentType") String contentType,
                          @JsonProperty("intents") String intents,
                          @JsonProperty("createdBy") String createdBy,
                          @JsonProperty("createdAt") LocalDateTime createdAt,
                          @JsonProperty("signed") boolean signed,
                          @JsonProperty("expired") boolean expired) {
        this.id = id;
        this.title = title;
        this.size = size;
        this.extension = extension;
        this.path = path;
        this.contentType = contentType;
        this.intents = intents;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.signed = signed;
        this.expired = expired;

        this.resourceType = null;
        this.resourceQualifier = null;
    }

    public FileProjection(UUID id, String title, Long size, String extension, String path, String contentType,
                          String intents, String resourceType, JsonNode resourceQualifier, String createdBy,
                          LocalDateTime createdAt, boolean signed, boolean expired) {
        this.id = id;
        this.title = title;
        this.size = size;
        this.extension = extension;
        this.path = path;
        this.contentType = contentType;
        this.intents = intents;
        this.resourceType = resourceType;
        this.resourceQualifier = resourceQualifier;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.signed = signed;
        this.expired = expired;
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
