package ru.mycrg.common;

import ru.mycrg.common.enums.EventType;

import java.io.Serializable;

public class OrgMqRequest implements Serializable {

    private Long orgId;
    private String rawPassword;
    private String comment;
    private String email;
    private String userName;

    private String projectName;

    private EventType type;

    public OrgMqRequest() {}

    public OrgMqRequest(long orgId, EventType type) {
        this.orgId = orgId;
        this.type = type;
    }

    public OrgMqRequest(long orgId, String email, String password, EventType type) {
        this.orgId = orgId;
        this.email = email;
        this.userName = email;
        this.rawPassword = password;
        this.type = type;
    }

    public Long getOrgId() {
        return orgId;
    }

    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }

    public String getRawPassword() {
        return rawPassword;
    }

    public void setRawPassword(String rawPassword) {
        this.rawPassword = rawPassword;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public EventType getType() {
        return type;
    }

    public void setType(EventType type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "OrgMqRequest{" +
                "orgId=" + orgId +
                ", comment='" + comment + '\'' +
                ", email='" + email + '\'' +
                ", userName='" + userName + '\'' +
                ", projectName='" + projectName + '\'' +
                ", type=" + type +
                '}';
    }
}
