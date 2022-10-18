package ru.mycrg.data_service.entity;

public class EpsgModel {

    private String authName;
    private Integer authSrid;
    private String proj4Text;

    public EpsgModel() {
        // Required
    }

    public String getAuthName() {
        return authName;
    }

    public void setAuthName(String authName) {
        this.authName = authName;
    }

    public Integer getAuthSrid() {
        return authSrid;
    }

    public void setAuthSrid(Integer authSrid) {
        this.authSrid = authSrid;
    }

    public String getProj4Text() {
        return proj4Text;
    }

    public void setProj4Text(String proj4Text) {
        this.proj4Text = proj4Text;
    }
}
