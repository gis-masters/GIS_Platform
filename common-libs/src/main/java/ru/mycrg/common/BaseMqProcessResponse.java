package ru.mycrg.common;

import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.common.enums.RequestType;

import java.util.UUID;

public class BaseMqProcessResponse {

    private UUID id;
    private int progress = -1;
    private String description;
    private ProcessStatus status;
    private RequestType type;

    public BaseMqProcessResponse() {}

    public BaseMqProcessResponse(UUID id, ProcessStatus status) {
        this.id = id;
        this.status = status;
    }

    public BaseMqProcessResponse(UUID id, ProcessStatus status, RequestType type) {
        this.id = id;
        this.type = type;
        this.status = status;
    }

    public BaseMqProcessResponse(UUID id, ProcessStatus status, String description, int progress) {
        this.id = id;
        this.status = status;
        this.progress = progress;
        this.description = description;
    }

    public BaseMqProcessResponse(UUID id, ProcessStatus status, RequestType type, int progress, String description) {
        this.id = id;
        this.progress = progress;
        this.description = description;
        this.status = status;
        this.type = type;
    }

    public boolean isDone() {
        return status == ProcessStatus.DONE;
    }

    public boolean isEmpty() {
        return status == ProcessStatus.EMPTY;
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

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public RequestType getType() {
        return type;
    }

    public void setType(RequestType type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "BaseMqProcessResponse{" +
                "id=" + id +
                ", progress=" + progress +
                ", description='" + description + '\'' +
                ", status=" + status +
                ", type=" + type +
                '}';
    }
}
