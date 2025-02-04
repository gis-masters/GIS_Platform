package ru.mycrg.data_service_contract.dto.import_;

import ru.mycrg.data_service_contract.dto.SchemaDto;

public class ImportKptTableDto {

    private String crs;
    private SchemaDto schema;
    private String dataset;
    private String table;

    public ImportKptTableDto() {
        // Required
    }

    public ImportKptTableDto(String dataset, String table, SchemaDto schema, String crs) {
        this.schema = schema;
        this.dataset = dataset;
        this.table = table;
        this.crs = crs;
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

    @Override
    public String toString() {
        return "{" +
                "\"crs\":" + (crs == null ? "null" : "\"" + crs + "\"") + ", " +
                "\"dataset\":" + (dataset == null ? "null" : "\"" + dataset + "\"") + ", " +
                "\"table\":" + (table == null ? "null" : "\"" + table + "\"") +
                "}";
    }
}
