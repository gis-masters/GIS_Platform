package ru.mycrg.acceptance.auth_service.dto;

import ru.mycrg.auth_service_contract.dto.UserCommonDto;

public class UserDto extends UserCommonDto {

    private String createdBy;
    private String createdAt;
    private String updatedBy;
    private String geoserverLogin;
    private String bossId;
    private String department;

    public UserDto() {
        // Required
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getBossId() {
        return bossId;
    }

    public void setBossId(String bossId) {
        this.bossId = bossId;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public String getGeoserverLogin() {
        return geoserverLogin;
    }

    public void setGeoserverLogin(String geoserverLogin) {
        this.geoserverLogin = geoserverLogin;
    }
}
