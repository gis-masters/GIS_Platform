package ru.mycrg.data_service_contract.dto;

import javax.validation.constraints.NotNull;

public class DatasetResourceQualifierDto {
    @NotNull
    private String dataset;

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

    @NotNull
    private String table;
}
