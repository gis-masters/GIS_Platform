package ru.mycrg.data_service_contract.dto;

import java.util.ArrayList;
import java.util.List;

public class ImportReport {

    private String datasetIdentifier;
    private Long projectId;
    private String projectName;
    private boolean projectIsNew;
    private List<ImportLayerReport> importLayerReports = new ArrayList<>();
    private boolean success;
    private String reason;

    public ImportReport() {
        // Required
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

    public void setImportLayerReports(List<ImportLayerReport> importLayerReports) {
        this.importLayerReports = importLayerReports;
    }

    public void addImportLayerReport(ImportLayerReport importLayerReport) {
        this.importLayerReports.add(importLayerReport);
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public boolean isProjectIsNew() {
        return projectIsNew;
    }

    public void setProjectIsNew(boolean projectIsNew) {
        this.projectIsNew = projectIsNew;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
