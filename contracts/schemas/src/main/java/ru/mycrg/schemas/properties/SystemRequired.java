package ru.mycrg.schemas.properties;

import ru.mycrg.schemas.IEntityProperty;

public class SystemRequired implements IEntityProperty {

    private PropertyType propertyType;
    private String name;
    private String title;

    public SystemRequired() {
        // Required
    }

    public SystemRequired(String name, PropertyType type, String title) {
        this.name = name;
        this.propertyType = type;
        this.title = title;
    }

    @Override
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public PropertyType getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(PropertyType propertyType) {
        this.propertyType = propertyType;
    }

    @Override
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
