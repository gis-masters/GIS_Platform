package ru.mycrg.data_service.entity;

import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "resource_description")
public class ResourceDescription {

    @EmbeddedId
    private TypeResourceIdentifierKey key;

    @Column(nullable = false)
    private String title;

    @Column(length = 1024)
    private String details;

    @Column(insertable = false, updatable = false, length = 20, nullable = false)
    private String type;

    @Column(insertable = false, updatable = false, nullable = false)
    private String resourceIdentifier;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "last_modified")
    private @LastModifiedDate LocalDateTime lastModified = LocalDateTime.now();

    public ResourceDescription() {
    }

    public TypeResourceIdentifierKey getKey() {
        return key;
    }

    public void setKey(TypeResourceIdentifierKey key) {
        this.key = key;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getResourceIdentifier() {
        return resourceIdentifier;
    }

    public void setResourceIdentifier(String resourceIdentifier) {
        this.resourceIdentifier = resourceIdentifier;
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
}
