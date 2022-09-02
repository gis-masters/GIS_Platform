package ru.mycrg.gis_service.dto.geoserver;

import javax.validation.constraints.NotNull;

public class OrgCreateDto {

    @NotNull
    private Long orgId;

    @NotNull
    private String ownerRawPassword;

    @NotNull
    private String ownerEmail;

    @NotNull
    private String ownerUserName;

    private String geoserverLogin;

    public OrgCreateDto() {
    }

    public Long getOrgId() {
        return orgId;
    }

    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }

    public String getOwnerRawPassword() {
        return ownerRawPassword;
    }

    public void setOwnerRawPassword(String ownerRawPassword) {
        this.ownerRawPassword = ownerRawPassword;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }

    public String getOwnerUserName() {
        return ownerUserName;
    }

    public void setOwnerUserName(String ownerUserName) {
        this.ownerUserName = ownerUserName;
    }

    public String getGeoserverLogin() {
        return geoserverLogin;
    }

    public void setGeoserverLogin(String geoserverLogin) {
        this.geoserverLogin = geoserverLogin;
    }

    public String toJsonString() {
        return "{\"orgId\":" + orgId +
                ",\"ownerRawPassword\":\"" + ownerRawPassword + "\"" +
                ",\"geoserverLogin\":\"" + geoserverLogin + "\"" +
                ",\"ownerEmail\":\"" + ownerEmail + "\"" +
                ",\"ownerUserName\":\"" + ownerUserName + "\"" +
                "}";
    }
}
