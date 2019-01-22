package ru.mycrg.common;

import ru.mycrg.common.propertyTypes.*;

import java.util.ArrayList;
import java.util.List;

// Inheritance other EntityType
public class EntityType {

    private String name;
    private String title;
    private String description;
    private String tableName;
    private List<AbstractProperty> properties = new ArrayList<>();

    public EntityType() {}

    public EntityType(String name) {
        this.name = name;
    }

    public void addProperty(AbstractProperty property) {
        properties.add(property);
    }

    public List<AbstractProperty> getProperties() {
        return properties;
    }

    public void setProperties(List<AbstractProperty> properties) {
        this.properties = properties;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }
}
