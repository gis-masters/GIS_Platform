package ru.mycrg.schemas.properties;

public class SystemRequired {

    private String name;
    private PropertyType propertyType;
    private String title;

    public SystemRequired() {
        // Required
    }

    public SystemRequired(String name, PropertyType propertyType, String title) {
        this.name = name;
        this.propertyType = propertyType;
        this.title = title;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public PropertyType getFieldType() {
        return propertyType;
    }

    public void setFieldType(PropertyType propertyType) {
        this.propertyType = propertyType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
