package ru.mycrg.common;

import java.util.LinkedHashSet;
import java.util.Set;

public class EntityTypeDto {

    private String name;
    private String title;
    private String description;
    private String tableName;
    private Set<SimplePropertyDto> properties = new LinkedHashSet<>();
    private String customRuleFunction = "";

    public EntityTypeDto() {}

    public String getClearName() {
        return name.split("_")[0];
    }

    public void addProperty(SimplePropertyDto propertyDto) {
        properties.add(propertyDto);
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

    public Set<SimplePropertyDto> getProperties() {
        return properties;
    }

    public void setProperties(Set<SimplePropertyDto> properties) {
        this.properties = properties;
    }

    public String getCustomRuleFunction() {
        return customRuleFunction;
    }

    public void setCustomRuleFunction(String customRuleFunction) {
        this.customRuleFunction = customRuleFunction;
    }
}
