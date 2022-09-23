package ru.mycrg.data_service.service.import_.model;

import ru.mycrg.data_service.dto.BaseWsModel;

import java.util.UUID;

public class FilePlacementPayloadModel extends BaseWsModel {

    protected String crs;
    protected UUID fileId;
    protected Long projectId;

    public FilePlacementPayloadModel() {
        // Required
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
                "\"fileId\":" + (fileId == null ? "null" : fileId) + ", " +
                "\"crs\":" + (crs == null ? "null" : "\"" + crs + "\"") + ", " +
                "\"projectId\":" + (projectId == null ? "null" : "\"" + projectId + "\"") + ", " +
                "\"wsUiId\":" + (wsUiId == null ? "null" : "\"" + wsUiId + "\"") +
                "}";
    }
}
