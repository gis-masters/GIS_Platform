package ru.mycrg.data_service_contract.dto;

public class ImportLayerReport {

    private String schemaId;
    private long successCount;
    private long failedCount;
    private boolean success;
    private String reason;
    private String tableIdentifier;
    private String tableTitle;
    private String crs;
    private String styleName;

    public ImportLayerReport() {
        // Required
    }

    public ImportLayerReport(String tableTitle) {
        this.success = true;
        this.tableTitle = tableTitle;
    }

    public ImportLayerReport(String schemaId, boolean isSuccess, String reason) {
        this.schemaId = schemaId;
        this.success = isSuccess;
        this.reason = reason;
    }

    public ImportLayerReport(String schemaId, String crs) {
        this.schemaId = schemaId;
        this.crs = crs;
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

    public String getCrs() {
        return crs;
    }

    public void setCrs(String crs) {
        this.crs = crs;
    }

    public String getStyleName() {
        return styleName;
    }

    public void setStyleName(String styleName) {
        this.styleName = styleName;
    }

    @Override
    public String toString() {
        return "{" +
                "\"schemaId\":" + (schemaId == null ? "null" : "\"" + schemaId + "\"") + ", " +
                "\"successCount\":\"" + successCount + "\"" + ", " +
                "\"failedCount\":\"" + failedCount + "\"" + ", " +
                "\"success\":\"" + success + "\"" + ", " +
                "\"reason\":" + (reason == null ? "null" : "\"" + reason + "\"") + ", " +
                "\"tableIdentifier\":" + (tableIdentifier == null ? "null" : "\"" + tableIdentifier + "\"") + ", " +
                "\"tableTitle\":" + (tableTitle == null ? "null" : "\"" + tableTitle + "\"") + ", " +
                "\"crs\":" + (crs == null ? "null" : "\"" + crs + "\"") + ", " +
                "\"styleName\":" + (styleName == null ? "null" : "\"" + styleName + "\"") +
                "}";
    }
}
