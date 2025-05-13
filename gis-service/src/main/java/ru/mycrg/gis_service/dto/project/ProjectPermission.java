package ru.mycrg.gis_service.dto.project;

public class ProjectPermission {

    Long projectId;
    Long maxRole;

    public ProjectPermission() {
        // Required
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public Long getMaxRole() {
        return maxRole;
    }

    public void setMaxRole(Long maxRole) {
        this.maxRole = maxRole;
    }
}
