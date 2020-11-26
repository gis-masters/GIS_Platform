package ru.mycrg.data_service.entity;

import ru.mycrg.data_service.dto.ResourceType;

import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ResourceKey implements Serializable {

    private String type;
    private String identifier;

    public ResourceKey() {
        // Required by framework
    }

    public ResourceKey(ResourceType type, String identifier) {
        this.type = type.name();
        this.identifier = identifier;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ResourceKey that = (ResourceKey) o;
        return getType().equals(that.getType()) &&
                getIdentifier().equals(that.getIdentifier());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getType(), getIdentifier());
    }
}
