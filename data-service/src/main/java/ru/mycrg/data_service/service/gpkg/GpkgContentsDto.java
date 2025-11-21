package ru.mycrg.data_service.service.gpkg;

public class GpkgContentsDto {

    String tableName;
    String description;
    Integer sriId;

    public GpkgContentsDto(String tableName, String description, Integer sriId) {
        this.tableName = tableName;
        this.description = description;
        this.sriId = sriId;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getSriId() {
        return sriId;
    }

    public void setSriId(Integer sriId) {
        this.sriId = sriId;
    }
}
