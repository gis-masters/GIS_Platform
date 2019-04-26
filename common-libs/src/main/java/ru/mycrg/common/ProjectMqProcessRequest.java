package ru.mycrg.common;

import java.io.Serializable;

public class ProjectMqProcessRequest extends BaseMqProcessRequest implements Serializable {

    private Long orgId;
    private String projectName;

    public ProjectMqProcessRequest() {}

    public ProjectMqProcessRequest(Long orgId, String projectName) {
        this.orgId = orgId;
        this.projectName = projectName;
    }

    public Long getOrgId() {
        return orgId;
    }

    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

}
