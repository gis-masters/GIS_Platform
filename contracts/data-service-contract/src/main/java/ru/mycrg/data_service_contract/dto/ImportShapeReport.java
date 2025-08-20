package ru.mycrg.data_service_contract.dto;

public class ImportShapeReport {

    private String datasetIdentifier;
    private String tableIdentifier;
    private boolean success;
    private String reason;
    private String message;
    private String warningMessage;
    private String errorMessage;
    private Long quantityOfImportedRecords;
    private Integer quantityOfFailedRecords;
    private boolean shapeFileHasProjection;
    private String targetCrs;

    public ImportShapeReport() {
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

    public Integer getQuantityOfFailedRecords() {
        return quantityOfFailedRecords;
    }

    public void setQuantityOfFailedRecords(Integer quantityOfFailedRecords) {
        this.quantityOfFailedRecords = quantityOfFailedRecords;
    }

    public boolean isShapeFileHasProjection() {
        return shapeFileHasProjection;
    }

    public void setShapeFileHasProjection(boolean shapeFileHasProjection) {
        this.shapeFileHasProjection = shapeFileHasProjection;
    }

    public String getTargetCrs() {
        return targetCrs;
    }

    public void setTargetCrs(String targetCrs) {
        this.targetCrs = targetCrs;
    }

    public String getWarningMessage() {
        return warningMessage;
    }

    public void setWarningMessage(String warningMessage) {
        this.warningMessage = warningMessage;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}
