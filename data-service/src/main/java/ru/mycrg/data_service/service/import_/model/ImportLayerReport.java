package ru.mycrg.data_service.service.import_.model;

public class ImportLayerReport {

    private String schemaId;
    private long successCount;
    private long failedCount;
    private boolean success;
    private String reason;
    private String tableIdentifier;
    private String tableTitle;

    public ImportLayerReport(String schemaId) {
        this.schemaId = schemaId;
    }

    public String getSchemaId() {
        return schemaId;
    }

    public void setSchemaId(String schemaId) {
        this.schemaId = schemaId;
    }

    public long getSuccessCount() {
        return successCount;
    }

    public void setSuccessCount(long successCount) {
        this.successCount = successCount;
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

    public long getFailedCount() {
        return failedCount;
    }

    public void setFailedCount(long failedCount) {
        this.failedCount = failedCount;
    }

    public String getTableIdentifier() {
        return tableIdentifier;
    }

    public void setTableIdentifier(String tableIdentifier) {
        this.tableIdentifier = tableIdentifier;
    }

    public String getTableTitle() {
        return tableTitle;
    }

    public void setTableTitle(String tableTitle) {
        this.tableTitle = tableTitle;
    }
}
