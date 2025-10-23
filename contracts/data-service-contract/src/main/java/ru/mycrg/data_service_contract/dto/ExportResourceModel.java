package ru.mycrg.data_service_contract.dto;

import javax.validation.constraints.NotEmpty;
import java.io.Serializable;
import java.util.Objects;

public class ExportResourceModel implements Serializable {

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

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        ExportResourceModel that = (ExportResourceModel) obj;
        return Objects.equals(dataset, that.dataset) && Objects.equals(table, that.table);
    }

    @Override
    public int hashCode() {
        return Objects.hash(dataset, table);
    }
}
