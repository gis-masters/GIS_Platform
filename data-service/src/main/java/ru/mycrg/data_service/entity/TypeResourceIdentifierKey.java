package ru.mycrg.data_service.entity;

import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class TypeResourceIdentifierKey implements Serializable {

    private String type;
    private String resourceIdentifier;

    public TypeResourceIdentifierKey() {
        // Required by framework
    }

    public TypeResourceIdentifierKey(String type, String resourceIdentifier) {
        this.type = type;
        this.resourceIdentifier = resourceIdentifier;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getResourceIdentifier() {
        return resourceIdentifier;
    }

    public void setResourceIdentifier(String resourceIdentifier) {
        this.resourceIdentifier = resourceIdentifier;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TypeResourceIdentifierKey that = (TypeResourceIdentifierKey) o;
        return getType().equals(that.getType()) &&
                getResourceIdentifier().equals(that.getResourceIdentifier());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getType(), getResourceIdentifier());
    }
}
