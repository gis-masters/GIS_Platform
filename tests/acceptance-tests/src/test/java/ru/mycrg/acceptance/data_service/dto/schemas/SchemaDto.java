package ru.mycrg.acceptance.data_service.dto.schemas;

import java.util.ArrayList;
import java.util.List;

public class SchemaDto {

    private String name;
    private String title;
    private String description;
    private String tableName;
    private List<String> tags = new ArrayList<>();
    private List<SimplePropertyDto> properties = new ArrayList<>();
    private String customRuleFunction = "";
    private String calcFiledFunction = "";
    private String originName;
    private String type;
    private boolean readOnly;
    private String geometryType;
    private String styleName;
    private List<Object> contentTypes = new ArrayList<>();
    private List<Object> printTemplates = new ArrayList<>();
    private List<Object> relations = new ArrayList<>();

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

    public String getCalcFiledFunction() {
        return calcFiledFunction;
    }

    public void setCalcFiledFunction(String calcFiledFunction) {
        this.calcFiledFunction = calcFiledFunction;
    }

    public boolean isReadOnly() {
        return readOnly;
    }

    public void setReadOnly(boolean readOnly) {
        this.readOnly = readOnly;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<SimplePropertyDto> getProperties() {
        return properties;
    }

    public void setProperties(List<SimplePropertyDto> properties) {
        this.properties = properties;
    }

    public String getGeometryType() {
        return geometryType;
    }

    public void setGeometryType(String geometryType) {
        this.geometryType = geometryType;
    }

    public List<Object> getContentTypes() {
        return contentTypes;
    }

    public void setContentTypes(List<Object> contentTypes) {
        this.contentTypes = contentTypes;
    }

    public List<Object> getPrintTemplates() {
        return printTemplates;
    }

    public void setPrintTemplates(List<Object> printTemplates) {
        this.printTemplates = printTemplates;
    }

    public List<Object> getRelations() {
        return relations;
    }

    public void setRelations(List<Object> relations) {
        this.relations = relations;
    }

    public String getStyleName() {
        return styleName;
    }

    public void setStyleName(String styleName) {
        this.styleName = styleName;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }
}
