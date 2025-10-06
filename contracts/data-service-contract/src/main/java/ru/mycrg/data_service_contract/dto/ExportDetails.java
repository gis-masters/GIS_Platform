package ru.mycrg.data_service_contract.dto;

import java.util.LinkedList;
import java.util.List;

public class ExportDetails {

    private String massage;

    private List<ExportResourceModel> resources = new LinkedList<>();

    public ExportDetails() {

    }

    public ExportDetails(String massage, List<ExportResourceModel> resources) {
        this.massage = massage;
        this.resources = resources;
    }

    public String getMassage() {
        return massage;
    }

    public void setMassage(String massage) {
        this.massage = massage;
    }

    public List<ExportResourceModel> getResources() {
        return resources;
    }

    public void setResources(List<ExportResourceModel> resources) {
        this.resources = resources;
    }
}
