package ru.mycrg.data_service.entity;

import org.springframework.data.annotation.LastModifiedDate;
import ru.mycrg.data_service.dto.ResourceCreateDto;
import ru.mycrg.data_service.dto.ResourceType;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "schemas_and_tables")
public class SchemasAndTables {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1024)
    private String details;

    @Column
    private boolean isFolder;

    @Column(updatable = false, nullable = false)
    private String identifier;

    @Column
    private String path;

    @Column
    private String crs;

    @Column
    private String schemaId;

    @Column(name = "items_count")
    private Integer itemsCount;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "last_modified")
    private @LastModifiedDate
    LocalDateTime lastModified = LocalDateTime.now();

    public SchemasAndTables() {
        // Required by framework
    }

    public SchemasAndTables(ResourceType resourceType, ResourceCreateDto dto, String identifier, String path) {
        this.identifier = identifier;
        this.title = dto.getTitle();
        this.details = dto.getDetails();
        this.isFolder = resourceType.equals(ResourceType.SCHEMA);
        this.path = path;

        this.itemsCount = 0;
        this.createdAt = LocalDateTime.now();
        this.lastModified = LocalDateTime.now();
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public boolean isFolder() {
        return isFolder;
    }

    public void setFolder(boolean folder) {
        isFolder = folder;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public Integer getItemsCount() {
        return itemsCount;
    }

    public void setItemsCount(Integer itemsCount) {
        this.itemsCount = itemsCount;
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

    public String getCrs() {
        return crs;
    }

    public void setCrs(String crs) {
        this.crs = crs;
    }

    public String getSchemaId() {
        return schemaId;
    }

    public void setSchemaId(String schemaId) {
        this.schemaId = schemaId;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String pathTo() {
        return getPath() + "/" + getId();
    }
}
