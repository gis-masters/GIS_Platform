package ru.mycrg.data_service_contract.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class ErrorReport implements Serializable {

    private int failedRecordCount;
    private boolean shpFileHasProjection = true;
    private int utf8ErrorCount;
    private List<String> messages = new ArrayList<>();

    public ErrorReport() {
        // Required
    }

    public int getFailedRecordCount() {
        return failedRecordCount;
    }

    public int getUtf8ErrorCount() {
        return utf8ErrorCount;
    }

    public void setUtf8ErrorCount(int utf8ErrorCount) {
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

    public List<String> getMessages() {
        return messages != null ? messages : new ArrayList<>();
    }

    public void setMessages(List<String> messages) {
        this.messages = messages != null ? messages : new ArrayList<>();
    }

    @Override
    public String toString() {
        return "{" +
                "\"failedRecordCount\":" + failedRecordCount + ", " +
                "\"shpFileHasProjection\":" + shpFileHasProjection + ", " +
                "\"utf8ErrorCount\":" + utf8ErrorCount +
                "}";
    }
}
