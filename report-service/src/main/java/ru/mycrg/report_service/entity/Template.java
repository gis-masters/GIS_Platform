package ru.mycrg.report_service.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import ru.mycrg.common_contracts.generated.report_service.TemplateCreateDto;
import tools.jackson.databind.JsonNode;

import java.time.LocalDateTime;

@Entity
@Table(name = "templates")
public class Template {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String path;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private JsonNode printFormSchemaOverrides;

    @Column(length = 50)
    private String createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "is_system", nullable = false)
    private Boolean isSystem = false;

    @Column(name = "hidden", nullable = false)
    private Boolean hidden = false;

    @Column(name = "type")
    private String type;

    public Template() {
    }

    public Template(Long id, String title, String name, String path, JsonNode printFormSchemaOverrides,
                    String createdBy, LocalDateTime createdAt, Boolean isSystem, Boolean hidden, String type) {
        this.id = id;
        this.title = title;
        this.name = name;
        this.path = path;
        this.printFormSchemaOverrides = printFormSchemaOverrides;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.isSystem = isSystem;
        this.hidden = hidden;
        this.type = type;
    }

    public Template(TemplateCreateDto dto, String path, String createdBy, LocalDateTime createdAt, boolean isSystem) {
        this.name = dto.getName();
        this.title = dto.getTitle();
        this.printFormSchemaOverrides = dto.getPrintFormSchemaOverrides();
        this.path = path;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.isSystem = isSystem;
    }

    public Template(TemplateCreateDto dto, String path, String createdBy, LocalDateTime createdAt) {
        this(dto, path, createdBy, createdAt, false);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public JsonNode getPrintFormSchemaOverrides() {
        return printFormSchemaOverrides;
    }

    public void setPrintFormSchemaOverrides(JsonNode schema) {
        this.printFormSchemaOverrides = schema;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean isSystem() {
        return isSystem;
    }

    public void setSystem(Boolean system) {
        isSystem = system;
    }

    public Boolean getSystem() {
        return isSystem;
    }

    public Boolean isHidden() {
        return hidden;
    }

    public void setHidden(Boolean hidden) {
        this.hidden = hidden;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
