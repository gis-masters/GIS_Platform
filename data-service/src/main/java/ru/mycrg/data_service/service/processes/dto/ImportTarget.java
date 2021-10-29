package ru.mycrg.data_service.service.processes.dto;

public class ImportTarget {

    private Long projectId;
    private String projectName;
    private boolean projectIsNew;

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
}
