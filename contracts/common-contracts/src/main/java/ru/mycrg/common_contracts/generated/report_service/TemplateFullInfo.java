package ru.mycrg.common_contracts.generated.report_service;

import tools.jackson.databind.JsonNode;

public class TemplateFullInfo extends TemplateCreateDto {

    private Long id;
    private String createdBy;
    private String createdAt;
    private Boolean isSystem;
    private Boolean isHidden;
    private String type;

    public TemplateFullInfo() {
        //req
    }

    public TemplateFullInfo(String name, String title, Long id, JsonNode schema,
                            String createdBy, String createdAt, Boolean isSystem, Boolean isHidden, String type) {
        super(name, title, schema);
        this.id = id;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.isSystem = isSystem;
        this.isHidden = isHidden;
        this.type = type;
    }

    public TemplateFullInfo(String name, String title, JsonNode schema) {
        super(name, title, schema);
        this.isSystem = false;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Boolean getSystem() {
        return isSystem;
    }

    public void setSystem(Boolean system) {
        isSystem = system;
    }

    public Boolean getHidden() {
        return isHidden;
    }

    public void setHidden(Boolean hidden) {
        isHidden = hidden;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
