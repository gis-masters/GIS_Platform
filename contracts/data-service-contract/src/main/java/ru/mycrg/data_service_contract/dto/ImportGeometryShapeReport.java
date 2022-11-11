package ru.mycrg.data_service_contract.dto;

public class ImportGeometryShapeReport {

    private String datasetIdentifier;
    private String tableIdentifier;
    private boolean success;
    private String reason;
    private String message;
    private Long quantityOfImportedRecords;

    public ImportGeometryShapeReport() {
        // Required
    }

    public String getDatasetIdentifier() {
        return datasetIdentifier;
    }

    public void setDatasetIdentifier(String datasetIdentifier) {
        this.datasetIdentifier = datasetIdentifier;
    }

    public String getTableIdentifier() {
        return tableIdentifier;
    }

    public void setTableIdentifier(String tableIdentifier) {
        this.tableIdentifier = tableIdentifier;
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

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getQuantityOfImportedRecords() {
        return quantityOfImportedRecords;
    }

    public void setQuantityOfImportedRecords(Long quantityOfImportedRecords) {
        this.quantityOfImportedRecords = quantityOfImportedRecords;
    }
}
