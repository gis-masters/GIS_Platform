package ru.mycrg.gis.service.fgistp;

import ru.mycrg.common.propertyTypes.AbstractProperty;

import java.util.ArrayList;
import java.util.List;

public class FeatureDescription {

    private String name;
    private String title;
    private String description;
    private String tableName;
    private List<AbstractProperty> properties = new ArrayList<>();
    private String customRuleFunction;
    private String originName;

    public FeatureDescription() {}

    public FeatureDescription(String name) {
        this.name = name;
    }

    public FeatureDescription(FeatureDescription featureDescription) {
        this.name = featureDescription.getName();
        this.title = featureDescription.getTitle();
        this.description = featureDescription.getDescription();
        this.tableName = featureDescription.getTableName();
        this.customRuleFunction = featureDescription.getCustomRuleFunction();
        this.properties = featureDescription.getProperties();
        this.originName = featureDescription.getOriginName();
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
