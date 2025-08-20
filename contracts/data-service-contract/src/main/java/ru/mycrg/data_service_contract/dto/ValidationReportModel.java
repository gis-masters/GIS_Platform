package ru.mycrg.data_service_contract.dto;

import ru.mycrg.data_service_contract.enums.ProcessStatus;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ValidationReportModel {

    private final List<ResourceReport> resourceReports = new ArrayList<>();
    private final UUID id;

    private Object payload;
    private ProcessStatus status;
    private String description;
    private String error;

    public ValidationReportModel() {
        this.id = UUID.randomUUID();
    }

    public ValidationReportModel(Object payload, String description) {
        this();

        this.payload = payload;
        this.description = description;
    }

    public List<ResourceReport> getResourceReports() {
        return resourceReports;
    }

    public void addResourceReports(ResourceReport detailsProjection) {
        this.resourceReports.add(detailsProjection);
    }

    public ProcessStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessStatus status) {
        this.status = status;
    }

    public Object getPayload() {
        return payload;
    }

    public void setPayload(Object payload) {
        this.payload = payload;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public UUID getId() {
        return id;
    }
}
