package ru.mycrg.data_service_contract.dto;

import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.data_service_contract.queue.request.ExportRequestEvent;

public class BaseWsProcessModel {

    private long id;
    private int progress = -1;
    private String description;
    private String error;
    private ProcessStatus status;
    private ExportProcessModel payload;

    public BaseWsProcessModel(ExportRequestEvent event) {
        this.id = event.getProcessId();
    }

    public boolean isDone() {
        return status == ProcessStatus.DONE;
    }

    public boolean isError() {
        return status == ProcessStatus.ERROR;
    }

    public boolean isPending() {
        return status == ProcessStatus.PENDING;
    }

    public boolean isNull() {
        return status == null;
    }

    public ProcessStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessStatus status) {
        this.status = status;
    }

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        this.progress = progress;
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

    public ExportProcessModel getPayload() {
        return payload;
    }

    public void setPayload(ExportProcessModel payload) {
        this.payload = payload;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "BaseWsProcessModel{" +
                "id=" + id +
                ", progress=" + progress +
                ", description='" + description + '\'' +
                ", error='" + error + '\'' +
                ", status=" + status +
                ", payload=" + payload +
                '}';
    }
}
