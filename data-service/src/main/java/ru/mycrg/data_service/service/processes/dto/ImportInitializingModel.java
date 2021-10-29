package ru.mycrg.data_service.service.processes.dto;

public class ImportInitializingModel {

    private String wsUiId;
    private ImportSource source;
    private ImportTarget target;

    public ImportInitializingModel() {
        // Required
    }

    public String getWsUiId() {
        return wsUiId;
    }

    public void setWsUiId(String wsUiId) {
        this.wsUiId = wsUiId;
    }

    public ImportSource getSource() {
        return source;
    }

    public void setSource(ImportSource source) {
        this.source = source;
    }

    public ImportTarget getTarget() {
        return target;
    }

    public void setTarget(ImportTarget target) {
        this.target = target;
    }

    @Override
    public String toString() {
        return "{" +
                "\"wsUiId\":" + (wsUiId == null ? "null" : "\"" + wsUiId + "\"") + ", " +
                "\"source\":" + (source == null ? "null" : source) + ", " +
                "\"target\":" + (target == null ? "null" : target) +
                "}";
    }
}
