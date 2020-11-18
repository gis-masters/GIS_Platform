package ru.mycrg.gis.dto;

import javax.validation.constraints.NotEmpty;

public class ExportResourceModel {

    @NotEmpty
    private String dataset;

    @NotEmpty
    private String table;

    @NotEmpty
    private String schemaId;

    public ExportResourceModel(String dataset, String table, String schemaId) {
        this.dataset = dataset;
        this.table = table;
        this.schemaId = schemaId;
    }

    public String getDataset() {
        return dataset;
    }

    public void setDataset(String dataset) {
        this.dataset = dataset;
    }

    public String getTable() {
        return table;
    }

    public void setTable(String table) {
        this.table = table;
    }

    public String getSchemaId() {
        return schemaId;
    }

    public void setSchemaId(String schemaId) {
        this.schemaId = schemaId;
    }

    @Override
    public String toString() {
        return dataset + "." + table;
    }
}
