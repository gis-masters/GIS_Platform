package ru.mycrg.common;

import ru.mycrg.common.enums.RequestType;

import java.io.Serializable;

public class OrgMqProcessRequest extends BaseMqProcessRequest implements Serializable {

    private Long orgId;
    private String rawPassword;
    private String comment;
    private String email;
    private String userName;

    public OrgMqProcessRequest() {}

    public OrgMqProcessRequest(long orgId, String email, String password, RequestType type) {
        super(type);

        this.orgId = orgId;
        this.email = email;
        this.userName = email;
        this.rawPassword = password;
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

    @Override
    public String toString() {
        return "OrgMqProcessRequest{" +
                "orgId=" + orgId +
                ", rawPassword='" + rawPassword + '\'' +
                ", comment='" + comment + '\'' +
                ", email='" + email + '\'' +
                ", userName='" + userName + '\'' +
                ", type='" + getType() + '\'' +
                '}';
    }
}
