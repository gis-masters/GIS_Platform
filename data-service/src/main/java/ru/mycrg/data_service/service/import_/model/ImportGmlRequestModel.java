package ru.mycrg.data_service.service.import_.model;

import java.util.UUID;

public class ImportGmlRequestModel {

    private String libraryId;
    private Long objectId;
    private Long projectId;
    private String projectName;
    private boolean projectIsNew;
    private String wsUiId;
    private UUID wsMsgId;

    public ImportGmlRequestModel() {
        // Required
    }

    public Long getObjectId() {
        return objectId;
    }

    public void setObjectId(Long objectId) {
        this.objectId = objectId;
    }

    public String getLibraryId() {
        return libraryId;
    }

    public void setLibraryId(String libraryId) {
        this.libraryId = libraryId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getWsUiId() {
        return wsUiId;
    }

    public void setWsUiId(String wsUiId) {
        this.wsUiId = wsUiId;
    }

    public UUID getWsMsgId() {
        return wsMsgId;
    }

    public void setWsMsgId(UUID wsMsgId) {
        this.wsMsgId = wsMsgId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public boolean isProjectIsNew() {
        return projectIsNew;
    }

    public void setProjectIsNew(boolean projectIsNew) {
        this.projectIsNew = projectIsNew;
    }

    @Override
    public String toString() {
        return "{" +
                "\"libraryId\":" + (libraryId == null ? "null" : "\"" + libraryId + "\"") + ", " +
                "\"objectId\":\"" + objectId + "\"" + ", " +
                "\"projectId\":\"" + projectId + "\"" + ", " +
                "\"projectName\":" + (projectName == null ? "null" : "\"" + projectName + "\"") + ", " +
                "\"projectIsNew\":\"" + projectIsNew + "\"" + ", " +
                "\"wsUiId\":" + (wsUiId == null ? "null" : "\"" + wsUiId + "\"") + ", " +
                "\"wsMsgId\":" + (wsMsgId == null ? "null" : wsMsgId) +
                "}";
    }
}
