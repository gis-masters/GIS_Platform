package ru.mycrg.data_service.dto;

import java.time.LocalDateTime;
import java.util.Objects;

public class BaseModel {

    private String title;
    private String details;
    private String type;
    private String resourceIdentifier;
    private Integer itemsCount;
    private String permission;
    private LocalDateTime createdAt;

    public BaseModel() {
    }

    public BaseModel(String tableName) {
        this.resourceIdentifier = tableName;
    }

    public BaseModel(String resourceIdentifier, String permission) {
        this.resourceIdentifier = resourceIdentifier;
        this.permission = permission;
    }

    public BaseModel(String title, String details, String type, String resourceIdentifier, Integer itemsCount,
                     String permission, LocalDateTime createdAt) {
        this.title = title;
        this.details = details;
        this.type = type;
        this.resourceIdentifier = resourceIdentifier;
        this.itemsCount = itemsCount;
        this.permission = permission;
        this.createdAt = createdAt;
    }

    public String getPermission() {
        return permission;
    }

    public void setPermission(String permission) {
        this.permission = permission;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getItemsCount() {
        return itemsCount;
    }

    public void setItemsCount(Integer itemsCount) {
        this.itemsCount = itemsCount;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BaseModel baseModel = (BaseModel) o;
        return getType().equals(baseModel.getType()) &&
                getResourceIdentifier().equals(baseModel.getResourceIdentifier());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getType(), getResourceIdentifier());
    }
}
