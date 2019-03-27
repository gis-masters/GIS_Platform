package ru.mycrg.common;

import java.util.ArrayList;
import java.util.List;

public class EntityTypeDto {

    private String name;
    private String title;
    private String description;
    private String tableName;
    private List<SimplePropertyDto> properties = new ArrayList<>();
    private String customRuleFunction = "";
    private String originName;

    public EntityTypeDto() {}

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

    public List<SimplePropertyDto> getProperties() {
        return properties;
    }

    public void setProperties(List<SimplePropertyDto> properties) {
        this.properties = properties;
    }

    public String getCustomRuleFunction() {
        return customRuleFunction;
    }

    public void setCustomRuleFunction(String customRuleFunction) {
        this.customRuleFunction = customRuleFunction;
    }

    public String getOriginName() {
        return originName;
    }

    public void setOriginName(String originName) {
        this.originName = originName;
    }
}
