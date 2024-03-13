package ru.mycrg.data_service.dto;

import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.Objects;

public class ResourceModel implements IResourceModel {

    private Long id;
    private String title;
    private String details;
    private String type;
    private String identifier;
    private Integer itemsCount;
    private String crs;
    private SchemaDto schema;
    private String createdAt;
    private String role;
    private String tableName;

    public ResourceModel() {
        // Required
    }

    public ResourceModel(Long id, String title, String details, String type, String identifier, Integer itemsCount,
                         String crs, SchemaDto schema, String createdAt, String role) {
        this.id = id;
        this.title = title;
        this.details = details;
        this.type = type;
        this.identifier = identifier;
        this.itemsCount = itemsCount;
        this.crs = crs;
        this.schema = schema;
        this.createdAt = createdAt;
        this.role = role;
    }

    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
    public String getCreatedAt() {
        return createdAt;
    }

    @Override
    public void setCreatedAt(String createdAt) {
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

    @Override
    public SchemaDto getSchema() {
        return schema;
    }

    public void setCrs(String crs) {
        this.crs = crs;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    @Override
    public String getTableName() {
        return tableName;
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
