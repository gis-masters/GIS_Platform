package ru.mycrg.data_service.service.import_.model;

import java.util.ArrayList;
import java.util.List;

public class ImportReport {

    private String datasetIdentifier;
    private List<ImportLayerReport> importLayerReports = new ArrayList<>();
    private List<DataTable> createdTables;

    public ImportReport() {
    }

    public String getDatasetIdentifier() {
        return datasetIdentifier;
    }

    public void setDatasetIdentifier(String datasetIdentifier) {
        this.datasetIdentifier = datasetIdentifier;
    }

    public List<ImportLayerReport> getImportLayerReports() {
        return importLayerReports;
    }

    public void setImportLayerReports(
            List<ImportLayerReport> importLayerReports) {
        this.importLayerReports = importLayerReports;
    }

    public List<DataTable> getCreatedTables() {
        return createdTables;
    }

    public void setCreatedTables(List<DataTable> createdTables) {
        this.createdTables = createdTables;
    }
}
