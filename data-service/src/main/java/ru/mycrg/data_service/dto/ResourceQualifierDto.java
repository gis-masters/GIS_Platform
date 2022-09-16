package ru.mycrg.data_service.dto;

public class ResourceQualifierDto {

    private String schema;
    private String table;

    public ResourceQualifierDto() {
        //Required
    }

    public String getSchema() {
        return schema;
    }

    public void setSchema(String schema) {
        this.schema = schema;
    }

    public String getTable() {
        return table;
    }

    public void setTable(String table) {
        this.table = table;
    }
}
