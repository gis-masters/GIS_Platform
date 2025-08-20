package ru.mycrg.data_service.dto;

import javax.validation.constraints.NotEmpty;

public class ExportResourceModel {

    @NotEmpty
    private String dataset;

    @NotEmpty
    private String table;

    public ExportResourceModel() {
        // Framework required
    }

    public ExportResourceModel(String dataset, String table) {
        this.dataset = dataset;
        this.table = table;
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
        return dataset + "." + table;
    }
}
