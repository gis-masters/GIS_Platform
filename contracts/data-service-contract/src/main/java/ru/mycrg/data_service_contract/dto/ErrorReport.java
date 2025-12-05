package ru.mycrg.data_service_contract.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class ErrorReport implements Serializable {

    private int failedRecordCount;
    private Long successfulRecordCount;
    private boolean shpFileHasProjection = true;
    private int utf8ErrorCount;
    private List<String> messages = new ArrayList<>();

    public ErrorReport() {
        // Required
    }

    public int getFailedRecordCount() {
        return failedRecordCount;
    }

    public void setFailedRecordCount(int failedRecordCount) {
        this.failedRecordCount = failedRecordCount;
    }

    public Long getSuccessfulRecordCount() {
        return successfulRecordCount;
    }

    public void setSuccessfulRecordCount(Long successfulRecordCount) {
        this.successfulRecordCount = successfulRecordCount;
    }

    public int getUtf8ErrorCount() {
        return utf8ErrorCount;
    }

    public void setUtf8ErrorCount(int utf8ErrorCount) {
        this.utf8ErrorCount = utf8ErrorCount;
    }

    public boolean isShpFileHasProjection() {
        return shpFileHasProjection;
    }

    public void setShpFileHasProjection(boolean shpFileHasProjection) {
        this.shpFileHasProjection = shpFileHasProjection;
    }

    public List<String> getMessages() {
        return messages != null ? messages : new ArrayList<>();
    }

    public void setMessages(List<String> messages) {
        this.messages = messages != null ? messages : new ArrayList<>();
    }

    @Override
    public String toString() {
        return "{" +
                "\"failedRecordCount\":\"" + failedRecordCount + "\"" + ", " +
                "\"successfulRecordCount\":" + (successfulRecordCount == null ? "null" : "\"" + successfulRecordCount + "\"") + ", " +
                "\"shpFileHasProjection\":\"" + shpFileHasProjection + "\"" + ", " +
                "\"utf8ErrorCount\":\"" + utf8ErrorCount + "\"" + ", " +
                "\"messages\":" + (messages == null ? "null" : messages) +
                "}";
    }
}
