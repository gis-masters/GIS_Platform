package ru.mycrg.data_service_contract.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class ContentType {

    private String id;
    private String type;
    private String title;
    private String icon;
    private Boolean childOnly;
    private String styleName;
    private String definitionQuery;

    private List<SchemaChild> children = new ArrayList<>();
    private List<SimplePropertyDto> attributes = new ArrayList<>();
    private List<String> printTemplates = new ArrayList<>();
    private List<SchemaRelation> relations = new ArrayList<>();

    public ContentType() {
        // Required
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Boolean getChildOnly() {
        return childOnly;
    }

    public void setChildOnly(Boolean childOnly) {
        this.childOnly = childOnly;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<SimplePropertyDto> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<SimplePropertyDto> attributes) {
        this.attributes = attributes;
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

    public List<SchemaChild> getChildren() {
        return children;
    }

    public void setChildren(List<SchemaChild> children) {
        this.children = children;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
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
}
