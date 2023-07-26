package ru.mycrg.gisog_service_contract.dto;

import java.util.UUID;

public class LandPlot {

    private UUID guid;
    private String status;
    private String cadastralNum;
    private double area;
    private String location;

    public LandPlot() {
        // Required
    }

    public UUID getGuid() {
        return guid;
    }

    public void setGuid(UUID guid) {
        this.guid = guid;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCadastralNum() {
        return cadastralNum;
    }

    public void setCadastralNum(String cadastralNum) {
        this.cadastralNum = cadastralNum;
    }

    public double getArea() {
        return area;
    }

    public void setArea(double area) {
        this.area = area;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
