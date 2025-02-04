package ru.mycrg.data_service.service.import_.dto;

public class ImportInitializingModel {

    private String wsUiId;
    private ImportSource source;
    private ImportTarget target;
    private boolean invertedCoordinates;

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

    public Boolean getInvertedCoordinates() {
        return invertedCoordinates;
    }

    public void setInvertedCoordinates(Boolean invertedCoordinates) {
        this.invertedCoordinates = invertedCoordinates;
    }

    @Override
    public String toString() {
        return "{" +
                "\"wsUiId\":" + (wsUiId == null ? "null" : "\"" + wsUiId + "\"") + ", " +
                "\"source\":" + (source == null ? "null" : source) + ", " +
                "\"target\":" + (target == null ? "null" : target) +
                "\"invertedCoordinates\":" + invertedCoordinates +
                "}";
    }
}
