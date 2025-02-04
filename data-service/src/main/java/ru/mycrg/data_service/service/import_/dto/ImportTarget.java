package ru.mycrg.data_service.service.import_.dto;

public class ImportTarget {

    private Long projectId;
    private String projectName;
    private boolean projectIsNew;
    private String mode;

    public ImportTarget() {
        // Required
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
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

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    @Override
    public String toString() {
        return "{" +
                "\"projectId\":" + (projectId == null ? "null" : "\"" + projectId + "\"") + ", " +
                "\"projectName\":" + (projectName == null ? "null" : "\"" + projectName + "\"") + ", " +
                "\"projectIsNew\":\"" + projectIsNew + "\"" + ", " +
                "\"mode\":" + (mode == null ? "null" : "\"" + mode + "\"") +
                "}";
    }
}
