package ru.mycrg.data_service.dto;

import ru.mycrg.mq_queue_contract.enums.ProcessStatus;

public class TaskModel {

    private String layerName;
    private String description;
    private ProcessStatus status;
    private String error;

    public TaskModel() {}

    public TaskModel(ProcessStatus status, String error) {
        this.status = status;
        this.error = error;
    }

    public TaskModel(String layerName, ProcessStatus status, String error) {
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
