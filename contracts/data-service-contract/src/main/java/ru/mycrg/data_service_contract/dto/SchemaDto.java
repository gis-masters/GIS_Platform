package ru.mycrg.data_service_contract.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import ru.mycrg.data_service_contract.enums.GeometryType;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class SchemaDto {

    @NotBlank
    private String name;

    @NotBlank
    private String title;

    @NotBlank
    private String tableName;

    @Valid
    @NotEmpty
    private List<SimplePropertyDto> properties = new ArrayList<>();

    private String description;
    private String customRuleFunction = "";
    private String calcFiledFunction = "";
    private String originName;
    private String type;
    private String styleName;
    private String definitionQuery;
    private boolean readOnly;
    private GeometryType geometryType;
    private List<String> tags = new ArrayList<>();
    private List<ContentType> contentTypes = new ArrayList<>();
    private List<ContentType> views = new ArrayList<>();
    private List<String> printTemplates = new ArrayList<>();
    private List<SchemaRelation> relations = new ArrayList<>();
    private List<SchemaChild> children = new ArrayList<>();

    public SchemaDto() {
        // Required
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

    public List<ContentType> getContentTypes() {
        return contentTypes;
    }

    public void setContentTypes(List<ContentType> contentTypes) {
        this.contentTypes = contentTypes;
    }

    public List<ContentType> getViews() {
        return views;
    }

    public void setViews(List<ContentType> views) {
        this.views = views;
    }

    public List<String> getPrintTemplates() {
        return printTemplates;
    }

    public void setPrintTemplates(List<String> printTemplates) {
        this.printTemplates = printTemplates;
    }

    public List<SchemaRelation> getRelations() {
        return relations;
    }

    public void setRelations(List<SchemaRelation> relations) {
        this.relations = relations;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStyleName() {
        return styleName;
    }

    public void setStyleName(String styleName) {
        this.styleName = styleName;
    }

    public String getDefinitionQuery() {
        return definitionQuery;
    }

    public void setDefinitionQuery(String definitionQuery) {
        this.definitionQuery = definitionQuery;
    }

    public boolean isCompatibleByGeometry(SchemaDto otherSchema) {
        return getGeometryType().equals(otherSchema.getGeometryType());
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public List<SchemaChild> getChildren() {
        return children;
    }

    public void setChildren(List<SchemaChild> children) {
        this.children = children;
    }
}
