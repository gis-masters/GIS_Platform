package ru.mycrg.data_service.entity;

import org.springframework.data.annotation.LastModifiedDate;
import ru.mycrg.data_service.dto.ResourceCreateDto;
import ru.mycrg.data_service.dto.ResourceType;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "resource_description")
public class ResourceDescription {

    @EmbeddedId
    private ResourceKey key;

    @Column(nullable = false)
    private String title;

    @Column(length = 1024)
    private String details;

    @Column(insertable = false, updatable = false, length = 20, nullable = false)
    private String type;

    @Column(insertable = false, updatable = false, nullable = false)
    private String identifier;

    @Column
    private String owner;

    @Column(name = "items_count")
    private Integer itemsCount;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "last_modified")
    private @LastModifiedDate LocalDateTime lastModified = LocalDateTime.now();

    public ResourceDescription() {
        // Required by framework
    }

    public ResourceDescription(ResourceType rType, ResourceCreateDto dto, String identifier, String owner) {
        this.key = new ResourceKey(rType, identifier);
        this.title = dto.getTitle();
        this.details = dto.getDetails();
        this.type = rType.name();
        this.identifier = identifier;
        this.itemsCount = 0;
        this.owner = owner;
        this.createdAt = LocalDateTime.now();
        this.lastModified = LocalDateTime.now();
    }

    public ResourceKey getKey() {
        return key;
    }

    public void setKey(ResourceKey key) {
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

    public void setType(ResourceType type) {
        this.type = type.name();
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
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

    public Integer getItemsCount() {
        return itemsCount;
    }

    public void setItemsCount(Integer countEntities) {
        this.itemsCount = countEntities;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }
}
