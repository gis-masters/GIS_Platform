package ru.mycrg.data_service.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.vladmihalcea.hibernate.type.json.JsonNodeBinaryType;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.time.LocalDateTime;

import static java.time.LocalDateTime.now;

@Entity
@TypeDef(
        name = "jsonb-node",
        typeClass = JsonNodeBinaryType.class
)
@Table(name = "doc_libraries")
public class DocumentLibrary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @Column
    private String title;

    @Column(length = 1024)
    private String details;

    @Column
    private String path;

    @Column(nullable = false)
    private String tableName;

    @Type(type = "jsonb-node")
    @Column(columnDefinition = "jsonb")
    private JsonNode schema;

    @Column
    private Long registryCounter;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt = now();

    @Column(name = "last_modified")
    private @LastModifiedDate
    LocalDateTime lastModified = now();

    @Column
    private boolean versioned;

    @Column(name = "ready_for_fts")
    private Boolean readyForFts;

    @Column(name = "gisogd_rf_publication_order")
    private Integer gisogdRfPublicationOrder;

    public DocumentLibrary() {
        // Framework required
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    @Nullable
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Nullable
    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    @Nullable
    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    @Nullable
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Nullable
    public LocalDateTime getLastModified() {
        return lastModified;
    }

    public void setLastModified(LocalDateTime lastModified) {
        this.lastModified = lastModified;
    }

    @Nullable
    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Long getRegistryCounter() {
        return registryCounter;
    }

    public void setRegistryCounter(Long registryCounter) {
        this.registryCounter = registryCounter;
    }

    public boolean isVersioned() {
        return versioned;
    }

    public void setVersioned(boolean versioned) {
        this.versioned = versioned;
    }

    public Integer getGisogdRfPublicationOrder() {
        return gisogdRfPublicationOrder;
    }

    public void setGisogdRfPublicationOrder(Integer gisogdRfPublicationOrder) {
        this.gisogdRfPublicationOrder = gisogdRfPublicationOrder;
    }

    public Boolean getReadyForFts() {
        return readyForFts;
    }

    public void setReadyForFts(Boolean readyForFts) {
        this.readyForFts = readyForFts;
    }

    public JsonNode getSchema() {
        return schema;
    }

    public void setSchema(JsonNode schema) {
        this.schema = schema;
    }
}
