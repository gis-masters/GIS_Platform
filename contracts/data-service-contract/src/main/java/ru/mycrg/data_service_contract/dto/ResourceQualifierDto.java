package ru.mycrg.data_service_contract.dto;

import javax.validation.constraints.NotNull;

public class ResourceQualifierDto {

    @NotNull
    private String schema;

    @NotNull
    private String table;

    public ResourceQualifierDto() {
        //Required
    }

    public ResourceQualifierDto(String schema, String table) {
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
