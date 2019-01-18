package ru.mycrg.gis.dto.fgistp;

import ru.mycrg.gis.dto.fgistp.types.SimplePropertyBase;

import java.util.ArrayList;
import java.util.List;

public class EntityType {

    private String name;
    private String title;
    private String description;
    private String tableName;
    private List<SimplePropertyBase> properties = new ArrayList<>();

    public EntityType() {}

    public EntityType(String name) {
        this.name = name;
    }

    // TODO: Validation rules here
    // Inheritance other EntityType

    public void addProperty(SimplePropertyBase property) {
        properties.add(property);
    }

    public List<SimplePropertyBase> getProperties() {
        return properties;
    }

    public void setProperties(List<SimplePropertyBase> properties) {
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
