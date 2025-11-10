package ru.mycrg.data_service_contract.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import ru.mycrg.common_contracts.enums.Roles;

@JsonIgnoreProperties(ignoreUnknown = true)
//нам приходи isPublic спринг думает что нужно спать с public а такого поля нет
public class TableModelProjection {

    private Long id;
    private String title;
    private String details;
    private String type;
    private String identifier;
    private Integer itemsCount;
    private String crs;
    private SchemaDto schema;
    private String createdAt;
    private Roles role;
    private String tableName;
    private boolean isPublic;
    private boolean readyForFts;
    public String dataset;

    public TableModelProjection() {
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

    public String getCrs() {
        return crs;
    }

    public void setCrs(String crs) {
        this.crs = crs;
    }

    public SchemaDto getSchema() {
        return schema;
    }

    public void setSchema(SchemaDto schema) {
        this.schema = schema;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public Roles getRole() {
        return role;
    }

    public void setRole(Roles role) {
        this.role = role;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean aPublic) {
        isPublic = aPublic;
    }

    public boolean isReadyForFts() {
        return readyForFts;
    }

    public void setReadyForFts(boolean readyForFts) {
        this.readyForFts = readyForFts;
    }

    public String getDataset() {
        return dataset;
    }

    public void setDataset(String dataset) {
        this.dataset = dataset;
    }
}
