package ru.mycrg.acceptance.data_service.processes;

import java.util.UUID;

public class DxfPlacementModel {

    private String wsUiId;
    private UUID fileId;
    private Long projectId;
    private String crs = "EPSG:7829";

    public DxfPlacementModel() {
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

    public String getCrs() {
        return crs;
    }

    public void setCrs(String crs) {
        this.crs = crs;
    }

    @Override
    public String toString() {
        return "{" +
                "\"wsUiId\":" + (wsUiId == null ? "null" : "\"" + wsUiId + "\"") + ", " +
                "\"fileId\":" + (fileId == null ? "null" : fileId) + ", " +
                "\"projectId\":" + (projectId == null ? "null" : "\"" + projectId + "\"") + ", " +
                "\"crs\":" + (crs == null ? "null" : "\"" + crs + "\"") +
                "}";
    }
}
