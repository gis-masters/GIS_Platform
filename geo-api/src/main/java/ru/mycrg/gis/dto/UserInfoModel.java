package ru.mycrg.gis.dto;

public class UserInfoModel {

    private String userName;
    private String orgName;
    private Long orgId;

    public UserInfoModel() {}

    public UserInfoModel(String userName, String orgName, Long orgId) {
        this.userName = userName;
        this.orgName = orgName;
        this.orgId = orgId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getOrgName() {
        return orgName;
    }

    public void setOrgName(String orgName) {
        this.orgName = orgName;
    }

    public Long getOrgId() {
        return orgId;
    }

    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }
}
