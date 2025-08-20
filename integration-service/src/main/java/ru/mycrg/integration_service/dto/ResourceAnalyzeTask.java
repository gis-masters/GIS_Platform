package ru.mycrg.integration_service.dto;

import java.io.Serializable;
import java.util.UUID;

public class ResourceAnalyzeTask implements Serializable {

    private UUID id;
    private boolean complete;
    private String resourceType;
    private ResourceAnalyzeModel analyzer;

    public ResourceAnalyzeTask() {
        // Required
    }

    public ResourceAnalyzeTask(String resourceType, ResourceAnalyzeModel analyzer) {
        this.resourceType = resourceType;
        this.analyzer = analyzer;
        this.complete = false;
        this.id = UUID.randomUUID();
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public ResourceAnalyzeModel getAnalyzer() {
        return analyzer;
    }

    public void setAnalyzer(ResourceAnalyzeModel analyzer) {
        this.analyzer = analyzer;
    }

    public boolean isComplete() {
        return complete;
    }

    public void complete(boolean complete) {
        this.complete = complete;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }
}
