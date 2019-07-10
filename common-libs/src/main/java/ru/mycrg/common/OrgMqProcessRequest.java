package ru.mycrg.common;

import ru.mycrg.common.enums.ProcessType;

import java.io.Serializable;
import java.util.UUID;

public class OrgMqProcessRequest extends BaseMqProcessRequest implements Serializable {

    private Long orgId;
    private String rawPassword;
    private String comment;
    private String email;
    private String userName;

    private String projectName;

    public OrgMqProcessRequest() {}

    public OrgMqProcessRequest(Long id, long orgId, String email, String password, ProcessType type) {
        super(id, type);

        this.orgId = orgId;
        this.email = email;
        this.userName = email;
        this.rawPassword = password;
    }

    public OrgMqProcessRequest(Long id, long orgId, String geoserverName, ProcessType type) {
        super(id, type);

        this.orgId = orgId;
        this.projectName = geoserverName;
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

    @Override
    public String toString() {
        return "OrgMqProcessRequest{" +
                "orgId=" + orgId +
                ", comment='" + comment + '\'' +
                ", email='" + email + '\'' +
                ", userName='" + userName + '\'' +
                ", type='" + getType() + '\'' +
                '}';
    }
}
