package ru.mycrg.data_service_contract.dto;

public class ErrorReport {

    private int failedRecordCount;
    private boolean shpFileHasProjection = true;
    private int utf8ErrorCount;

    public ErrorReport() {
        // Required
    }

    public int getFailedRecordCount() {
        return failedRecordCount;
    }

    public int getUtf8ErrorCount(){
        return utf8ErrorCount;
    }
    public void setUtf8ErrorCount(int utf8ErrorCount){
        this.utf8ErrorCount = utf8ErrorCount;
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
