package ru.mycrg.data_service.dto;

import ru.mycrg.data_service_contract.enums.ProcessStatus;

public class ProcessModel {

    private String layerName;
    private String description;
    private ProcessStatus status;
    private String error;

    public ProcessModel() {}

    public ProcessModel(ProcessStatus status, String error) {
        this.status = status;
        this.error = error;
    }

    public ProcessModel(String layerName, ProcessStatus status, String error) {
        this.layerName = layerName;
        this.status = status;
        this.error = error;
    }

    public String getLayerName() {
        return layerName;
    }

    public void setLayerName(String layerName) {
        this.layerName = layerName;
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

    public ProcessStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessStatus status) {
        this.status = status;
    }
}
