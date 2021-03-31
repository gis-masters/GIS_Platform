package ru.mycrg.resource_analyzer_contract;

public class ResourceDefinitionImpl implements IResourceDefinition {

    private final String type;
    private final String typeTitle;

    public ResourceDefinitionImpl(String type, String typeTitle) {
        this.type = type;
        this.typeTitle = typeTitle;
    }

    @Override
    public String getType() {
        return type;
    }

    @Override
    public String getTypeTitle() {
        return typeTitle;
    }
}
