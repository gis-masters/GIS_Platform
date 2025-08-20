package ru.mycrg.acceptance.data_service.dto;

public class ExportResourceModel {

    private String dataset;
    private String table;
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
