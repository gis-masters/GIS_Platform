package ru.mycrg.resource_analyzer_contract;

import java.util.Map;

public class ResourceImpl implements IResource {

    private final String title;
    private final String id;
    private final ResourceDefinitionImpl resourceDefinition;
    private final Map<String, Object> resourceProperties;

    public ResourceImpl(String title,
                        String id,
                        ResourceDefinitionImpl resourceDefinition,
                        Map<String, Object> resourceProperties) {
        this.title = title;
        this.id = id;
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
    public IResourceDefinition getResourceDefinition() {
        return resourceDefinition;
    }

    @Override
    public Map<String, Object> getResourceProperties() {
        return resourceProperties;
    }
}
