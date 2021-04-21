package ru.mycrg.data_service.dto;

import ru.mycrg.data_service.entity.Resource;

import java.time.LocalDateTime;
import java.util.Objects;

public class ResourceModel implements IResourceModel {

    private String title;
    private String details;
    private String type;
    private String identifier;
    private Integer itemsCount;
    private String crs;
    private String schemaId;
    private String role;
    private LocalDateTime createdAt;

    public ResourceModel() {
        // Required
    }

    public ResourceModel(IResourceModel resource) {
        this.title = resource.getTitle();
        this.details = resource.getDetails();
        this.type = resource.getType();
        this.identifier = resource.getIdentifier();
        this.itemsCount = resource.getItemsCount();
        this.crs = resource.getCrs();
        this.schemaId = resource.getSchemaId();
        this.role = resource.getRole();
        this.createdAt = resource.getCreatedAt();
    }

    public ResourceModel(Resource resource, Roles role) {
        this.title = resource.getTitle();
        this.details = resource.getDetails();
        this.type = resource.getType();
        this.identifier = resource.getIdentifier();
        this.itemsCount = resource.getItemsCount();
        this.crs = resource.getCrs();
        this.schemaId = resource.getSchemaId();
        this.role = role.name();
        this.createdAt = resource.getCreatedAt();
    }

    public ResourceModel(String title, String details, String type, String identifier, String schemaId, String role,
                         LocalDateTime createdAt) {
        this.title = title;
        this.details = details;
        this.type = type;
        this.identifier = identifier;
        this.schemaId = schemaId;
        this.role = role;
        this.createdAt = createdAt;
    }

    @Override
    public String getRole() {
        return role;
    }

    @Override
    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public String getTitle() {
        return title;
    }

    @Override
    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public String getDetails() {
        return details;
    }

    @Override
    public void setDetails(String details) {
        this.details = details;
    }

    @Override
    public String getIdentifier() {
        return identifier;
    }

    @Override
    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    @Override
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    @Override
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String getType() {
        return type;
    }

    @Override
    public void setType(String type) {
        this.type = type;
    }

    @Override
    public Integer getItemsCount() {
        return itemsCount;
    }

    @Override
    public void setItemsCount(Integer itemsCount) {
        this.itemsCount = itemsCount;
    }

    @Override
    public String getCrs() {
        return crs;
    }

    public void setCrs(String crs) {
        this.crs = crs;
    }

    @Override
    public String getSchemaId() {
        return schemaId;
    }

    public void setSchemaId(String schemaId) {
        this.schemaId = schemaId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        IResourceModel resourceModel = (ResourceModel) o;
        return getType().equals(resourceModel.getType()) &&
                getIdentifier().equals(resourceModel.getIdentifier());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getType(), getIdentifier());
    }
}
