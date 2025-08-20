package ru.mycrg.acceptance.gis_service.dto;

import java.util.Objects;

public class ResourceDefinition {

    private final String type;
    private final String typeTitle;

    public ResourceDefinition(String type, String typeTitle) {
        this.type = type;
        this.typeTitle = typeTitle;
    }

    public String getType() {
        return type;
    }

    public String getTypeTitle() {
        return typeTitle;
    }

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

    public int hashCode() {
        return Objects.hash(getType(), getTypeTitle());
    }
}
