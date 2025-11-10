package ru.mycrg.common_contracts.generated.data_service.gpkg;

import java.io.Serializable;
import java.util.Map;

public class GpkgWrapperImportReport implements Serializable {

    private int failedRecordCount;
    private int utf8ErrorCount;
    private Map<String, Long> results;
    private String additionalInfo;

    public GpkgWrapperImportReport() {
        //Req
    }

    public GpkgWrapperImportReport(int failedRecordCount, int utf8ErrorCount) {
        this.failedRecordCount = failedRecordCount;
        this.utf8ErrorCount = utf8ErrorCount;
    }

    public int getFailedRecordCount() {
        return failedRecordCount;
    }

    public void setFailedRecordCount(int failedRecordCount) {
        this.failedRecordCount = failedRecordCount;
    }

    public int getUtf8ErrorCount() {
        return utf8ErrorCount;
    }

    public void setUtf8ErrorCount(int utf8ErrorCount) {
        this.utf8ErrorCount = utf8ErrorCount;
    }

    public Map<String, Long> getResults() {
        return results;
    }

    public void setResults(Map<String, Long> results) {
        this.results = results;
    }

    public String getAdditionalInfo() {
        return additionalInfo;
    }

    public void setAdditionalInfo(String additionalInfo) {
        this.additionalInfo = additionalInfo;
    }

    @Override
    public String toString() {
        return "{" +
                "\"failedRecordCount\":" + failedRecordCount + ", " +
                "\"utf8ErrorCount\":" + utf8ErrorCount + ", " +
                "\"results\":" + (results == null ? "null" : "\"" + results + "\"") + ", " +
                "\"additionalInfo\":" + (additionalInfo == null ? "null" : "\"" + additionalInfo + "\"") + ", " +
                "}";
    }
}
