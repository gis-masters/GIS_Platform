package ru.mycrg.data_service.entity;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.LastModifiedDate;
import tools.jackson.databind.JsonNode;

import java.time.LocalDateTime;

import static java.time.LocalDateTime.now;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@Entity
@Table(name = "schemas")
public class SchemaTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @Column
    private String name;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "json")
    private JsonNode classRule;

    @Column(columnDefinition = "text")
    private String customRule;

    @Column(columnDefinition = "text")
    private String calculatedFields;

    @Column(name = "is_system")
    private Boolean isSystem;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "last_modified")
    private @LastModifiedDate
    LocalDateTime lastModified;

    @Column(name = "modified_by")
    private String modifiedBy;

    public SchemaTemplate() {
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

    public Boolean getIsSystem() {
        return isSystem;
    }

    public void setIsSystem(Boolean isSystem) {
        this.isSystem = isSystem;
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

    public LocalDateTime getLastModified() {
        return lastModified;
    }

    public void setLastModified(LocalDateTime lastModified) {
        this.lastModified = lastModified;
    }

    public String getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(String modifiedBy) {
        this.modifiedBy = modifiedBy;
    }
}
