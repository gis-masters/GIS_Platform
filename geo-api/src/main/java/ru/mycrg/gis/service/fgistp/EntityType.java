package ru.mycrg.gis.service.fgistp;

import ru.mycrg.common.propertyTypes.AbstractProperty;

import java.util.LinkedHashSet;
import java.util.Set;

// Inheritance other EntityType
public class EntityType {

    private String name;
    private String title;
    private String description;
    private String tableName;
    private Set<AbstractProperty> properties = new LinkedHashSet<>();
    private String customRuleFunction;

    public EntityType() {}

    public EntityType(String name) {
        this.name = name;
    }

    public void addProperty(AbstractProperty property) {
        properties.add(property);
    }

    public Set<AbstractProperty> getProperties() {
        return properties;
    }

    public void setProperties(Set<AbstractProperty> properties) {
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

    public String getCustomRuleFunction() {
        return customRuleFunction;
    }

    public void setCustomRuleFunction(String customRuleFunction) {
        this.customRuleFunction = customRuleFunction;
    }
}
