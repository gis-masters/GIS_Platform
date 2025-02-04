package ru.mycrg.integration_service.dto;

import ru.mycrg.resource_analyzer_contract.impl.ResourceDefinition;

import java.io.Serializable;
import java.util.Map;

public class ResourceModel implements Serializable {

    private String id;
    private String title;
    private ResourceDefinition resourceDefinition;
    private Map<String, Object> resourceProperties;

    public ResourceModel() {
        // Required
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public ResourceDefinition getResourceDefinition() {
        return resourceDefinition;
    }

    public void setResourceDefinition(ResourceDefinition resourceDefinition) {
        this.resourceDefinition = resourceDefinition;
    }

    public Map<String, Object> getResourceProperties() {
        return resourceProperties;
    }

    public void setResourceProperties(Map<String, Object> resourceProperties) {
        this.resourceProperties = resourceProperties;
    }
}
