package ru.mycrg.resource_analyzer_contract.impl;

import ru.mycrg.resource_analyzer_contract.IResource;

import java.util.Map;

public class Resource implements IResource {

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

    @Override
    public String getId() {
        return id;
    }

    @Override
    public String getTitle() {
        return title;
    }

    @Override
    public ResourceDefinition getResourceDefinition() {
        return resourceDefinition;
    }

    @Override
    public Map<String, Object> getResourceProperties() {
        return resourceProperties;
    }
}
