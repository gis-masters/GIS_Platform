package ru.mycrg.resource_analyzer_contract.impl;

import ru.mycrg.resource_analyzer_contract.IResourceDefinition;

import java.io.Serializable;
import java.util.Objects;

public class ResourceDefinition implements IResourceDefinition, Serializable {

    private String type;
    private String typeTitle;

    public ResourceDefinition() {
        // Required
    }

    public ResourceDefinition(String type, String typeTitle) {
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ResourceDefinition)) {
            return false;
        }
        ResourceDefinition that = (ResourceDefinition) o;
        return getType().equals(that.getType()) && getTypeTitle().equals(that.getTypeTitle());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getType(), getTypeTitle());
    }
}
