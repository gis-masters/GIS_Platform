package ru.mycrg.acceptance.data_service.processes;

import java.util.UUID;

public class GmlPlacementModel {

    private String wsUiId;
    private UUID fileId;
    private Long projectId;
    private boolean invertedCoordinates;

    public GmlPlacementModel() {
        // Required
    }

    public String getWsUiId() {
        return wsUiId;
    }

    public void setWsUiId(String wsUiId) {
        this.wsUiId = wsUiId;
    }

    public UUID getFileId() {
        return fileId;
    }

    public void setFileId(UUID fileId) {
        this.fileId = fileId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public boolean isInvertedCoordinates() {
        return invertedCoordinates;
    }

    public void setInvertedCoordinates(boolean invertedCoordinates) {
        this.invertedCoordinates = invertedCoordinates;
    }

    @Override
    public String toString() {
        return "{" +
                "\"wsUiId\":" + (wsUiId == null ? "null" : "\"" + wsUiId + "\"") + ", " +
                "\"fileId\":" + (fileId == null ? "null" : fileId) + ", " +
                "\"projectId\":" + (projectId == null ? "null" : "\"" + projectId + "\"") + ", " +
                "\"invertedCoordinates\":\"" + invertedCoordinates + "\"" +
                "}";
    }
}
