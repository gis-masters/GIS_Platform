package ru.mycrg.common;

import ru.mycrg.common.enums.ProcessStatus;

import java.util.UUID;

public class BaseMqProcessResponse {

    private UUID id;
    private int progress = -1;
    private String description;
    private ProcessStatus status;

    public BaseMqProcessResponse() {}

    public BaseMqProcessResponse(UUID id, ProcessStatus status) {
        this.id = id;
        this.status = status;
    }

    public BaseMqProcessResponse(UUID id, ProcessStatus status, String description, int progress) {
        this.id = id;
        this.status = status;
        this.progress = progress;
        this.description = description;
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
}
