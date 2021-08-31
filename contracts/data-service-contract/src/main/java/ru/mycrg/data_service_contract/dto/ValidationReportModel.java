package ru.mycrg.data_service_contract.dto;

import java.util.ArrayList;
import java.util.List;

public class ValidationReportModel {

    private final List<ResourceReport> resourceReports = new ArrayList<>();
    private String filePath;

    public ValidationReportModel(String filePath) {
        this.filePath = filePath;
    }

    public List<ResourceReport> getResourceReports() {
        return resourceReports;
    }

    public void addResourceReports(ResourceReport detailsProjection) {
        this.resourceReports.add(detailsProjection);
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
}
