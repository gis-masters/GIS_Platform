package ru.mycrg.common_contracts.generated;

public class EpsgModel {

    private String authName;
    private Integer authSrid;
    private String srtext;
    private String proj4Text;

    public EpsgModel() {
        // Required
    }

    public EpsgModel(String authName, Integer authSrid, String srtext, String proj4Text) {
        this.authName = authName;
        this.authSrid = authSrid;
        this.srtext = srtext;
        this.proj4Text = proj4Text;
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

    public String getSrtext() {
        return srtext;
    }

    public void setSrtext(String srtext) {
        this.srtext = srtext;
    }
}
