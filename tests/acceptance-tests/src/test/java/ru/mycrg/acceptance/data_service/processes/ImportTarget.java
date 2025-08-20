package ru.mycrg.acceptance.data_service.processes;

public class ImportTarget {

    private Long projectId;
    private String projectName;
    private boolean projectIsNew;
    private String mode;

    public ImportTarget() {
        // Required
    }

    public ImportTarget(String projectName, boolean projectIsNew) {
        this.projectName = projectName;
        this.projectIsNew = projectIsNew;
    }

    public ImportTarget(Long projectId, String projectName, boolean projectIsNew) {
        this.projectId = projectId;
        this.projectName = projectName;
        this.projectIsNew = projectIsNew;
    }

    public ImportTarget(String projectName, boolean projectIsNew, String mode) {
        this.projectName = projectName;
        this.projectIsNew = projectIsNew;
        this.mode = mode;
    }

    public ImportTarget(Long projectId, boolean projectIsNew, String mode) {
        this.projectId = projectId;
        this.projectIsNew = projectIsNew;
        this.mode = mode;
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
}
