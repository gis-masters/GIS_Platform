package ru.mycrg.common;

import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.common.enums.ProcessType;

import java.util.UUID;

public class BaseMqProcessResponse {

    private Long id;
    private int progress = -1;
    private String description;
    private ProcessStatus status;
    private ProcessType type;

    public BaseMqProcessResponse() {}

    public BaseMqProcessResponse(Long id, ProcessStatus status, ProcessType type) {
        this.id = id;
        this.status = status;
        this.type = type;
    }

    public BaseMqProcessResponse(Long id, ProcessStatus status, ProcessType type, String description) {
        this.id = id;
        this.status = status;
        this.type = type;
        this.description = description;
    }

    public BaseMqProcessResponse(Long id, ProcessStatus status, ProcessType type, String description, int progress) {
        this.id = id;
        this.status = status;
        this.type = type;
        this.description = description;
        this.progress = progress;
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

    public ProcessType getType() {
        return type;
    }

    public void setType(ProcessType type) {
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
