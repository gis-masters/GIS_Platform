package ru.mycrg.data_service_contract.dto;

public class ErrorReport {

    private int failedRecordCount;
    private boolean shpFileHasProjection = true;

    public ErrorReport() {
        // Required
    }

    public int getFailedRecordCount() {
        return failedRecordCount;
    }

    public void setFailedRecordCount(int failedRecordCount) {
        this.failedRecordCount = failedRecordCount;
    }

    public boolean isShpFileHasProjection() {
        return shpFileHasProjection;
    }

    public void setShpFileHasProjection(boolean shpFileHasProjection) {
        this.shpFileHasProjection = shpFileHasProjection;
    }
}
