package ru.mycrg.common_contracts.generated.data_service;

import tools.jackson.databind.JsonNode;

public class SchemaTemplateProjection {

    private long id;
    private String name;
    private JsonNode classRule;
    private String customRule;
    private String calculatedFields;
    private Boolean system;
    private String createdBy;
    private String createdAt;
    private String lastModified;
    private String modifiedBy;

    public SchemaTemplateProjection() {
        // Required
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String className) {
        this.name = className;
    }

    public JsonNode getClassRule() {
        return classRule;
    }

    public void setClassRule(JsonNode classRule) {
        this.classRule = classRule;
    }

    public String getCustomRule() {
        return customRule;
    }

    public void setCustomRule(String customRule) {
        this.customRule = customRule;
    }

    public String getCalculatedFields() {
        return calculatedFields;
    }

    public void setCalculatedFields(String calculatedFields) {
        this.calculatedFields = calculatedFields;
    }

    public Boolean getSystem() {
        return system;
    }

    public void setSystem(Boolean system) {
        this.system = system;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getLastModified() {
        return lastModified;
    }

    public void setLastModified(String lastModified) {
        this.lastModified = lastModified;
    }

    public String getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(String modifiedBy) {
        this.modifiedBy = modifiedBy;
    }
}
