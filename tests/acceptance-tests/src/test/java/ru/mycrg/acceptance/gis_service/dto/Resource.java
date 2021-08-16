package ru.mycrg.acceptance.gis_service.dto;

import java.util.Map;

public class Resource {

    private final String id;
    private final String title;
    private final ResourceDefinition resourceDefinition;
    private final Map<String, Object> resourceProperties;

    public Resource(String id,
                    String title,
                    ResourceDefinition resourceDefinition,
                    Map<String, Object> resourceProperties) {
        this.id = id;
        this.title = title;
        this.resourceDefinition = resourceDefinition;
        this.resourceProperties = resourceProperties;
    }

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public ResourceDefinition getResourceDefinition() {
        return resourceDefinition;
    }

    public Map<String, Object> getResourceProperties() {
        return resourceProperties;
    }
}
