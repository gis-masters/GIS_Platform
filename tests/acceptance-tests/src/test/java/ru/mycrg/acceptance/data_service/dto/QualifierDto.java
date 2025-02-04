package ru.mycrg.acceptance.data_service.dto;

public class QualifierDto {

    private String schema;
    private String table;

    public QualifierDto(String schema, String table) {
        this.schema = schema;
        this.table = table;
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
