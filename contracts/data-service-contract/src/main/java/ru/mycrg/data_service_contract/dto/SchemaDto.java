package ru.mycrg.data_service_contract.dto;

import ru.mycrg.data_service_contract.enums.GeometryType;

import java.util.ArrayList;
import java.util.List;

public class SchemaDto {

    private String name;
    private String title;
    private String description;
    private String tableName;
    private List<SimplePropertyDto> properties = new ArrayList<>();
    private String customRuleFunction = "";
    private String calcFiledFunction = "";
    private String originName;
    private String type;
    private boolean readOnly;
    private GeometryType geometryType;
    private List<ContentTypes> contentTypes = new ArrayList<>();
    private List<String> printTemplates = new ArrayList<>();

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

    public GeometryType getGeometryType() {
        return geometryType;
    }

    public void setGeometryType(GeometryType geometryType) {
        this.geometryType = geometryType;
    }

    public List<ContentTypes> getContentTypes() {
        return contentTypes;
    }

    public void setContentTypes(List<ContentTypes> contentTypes) {
        this.contentTypes = contentTypes;
    }

    public List<String> getPrintTemplates() {
        return printTemplates;
    }

    public void setPrintTemplates(List<String> printTemplates) {
        this.printTemplates = printTemplates;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
