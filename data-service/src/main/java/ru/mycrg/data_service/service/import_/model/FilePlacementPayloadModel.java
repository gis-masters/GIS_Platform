package ru.mycrg.data_service.service.import_.model;

import ru.mycrg.data_service.dto.BaseWsModel;

import java.util.UUID;

public class FilePlacementPayloadModel extends BaseWsModel {

    private String crs;
    private UUID fileId;
    private Long projectId;
    private String style = "generic";
    private String mode = "FULL";

    public FilePlacementPayloadModel() {
        // Required
    }

    public String getCrs() {
        return crs;
    }

    public void setCrs(String crs) {
        this.crs = crs;
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

    public String getStyle() {
        return style;
    }

    public void setStyle(String style) {
        this.style = style;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    @Override
    public String toString() {
        return "{" +
                "\"crs\":" + (crs == null ? "null" : "\"" + crs + "\"") + ", " +
                "\"fileId\":" + (fileId == null ? "null" : fileId) + ", " +
                "\"projectId\":" + (projectId == null ? "null" : "\"" + projectId + "\"") + ", " +
                "\"style\":" + (style == null ? "null" : "\"" + style + "\"") + ", " +
                "\"mode\":" + (mode == null ? "null" : "\"" + mode + "\"") +
                "}";
    }
}
