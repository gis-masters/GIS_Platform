package ru.mycrg.common;

import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.common.import_.ImportMqResponse;

public class BaseMqProcessResponse extends BaseMqProcessRequest {

    private int progress = -1;
    private String description;
    private String error;
    private ProcessStatus status;

    public BaseMqProcessResponse() {}

    public BaseMqProcessResponse(BaseMqProcessRequest mqRequest) {
        super(mqRequest.getId(), mqRequest.getType());
    }

    public BaseMqProcessResponse(BaseMqProcessRequest mqRequest, Object payload) {
        super(mqRequest.getId(), mqRequest.getType(), payload);
    }

    public BaseMqProcessResponse(BaseMqProcessRequest mqRequest, Object payload, ProcessStatus status) {
        super(mqRequest.getId(), mqRequest.getType(), payload);

        this.status = status;
    }

    public BaseMqProcessResponse(BaseMqProcessRequest mqRequest, ProcessStatus status, String error) {
        super(mqRequest.getId(), mqRequest.getType());

        this.status = status;
        this.error = error;
    }

    public BaseMqProcessResponse(BaseMqProcessRequest mqRequest, ProcessStatus status, String description,
                                 int progress) {
        super(mqRequest.getId(), mqRequest.getType());

        this.status = status;
        this.description = description;
        this.progress = progress;
    }

    public BaseMqProcessResponse(BaseMqProcessRequest mqRequest, Object paylod, ProcessStatus status,
                                 String description,
                                 int progress) {
        super(mqRequest.getId(), mqRequest.getType(), paylod);

        this.status = status;
        this.description = description;
        this.progress = progress;
    }

    public BaseMqProcessResponse(BaseMqProcessRequest mqRequest, Object payload, ProcessStatus status,
                                 String description,
                                 String error) {
        super(mqRequest.getId(), mqRequest.getType(), payload);

        this.status = status;
        this.description = description;
        this.error = error;
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

    @Override
    public String toString() {
        return "BaseMqProcessResponse{" +
                "ID=" + getId() +
                ", type=" + getType() +
                ", progress=" + progress +
                ", description='" + description + '\'' +
                ", error='" + error + '\'' +
                ", status=" + status +
                ", payload=" + getPayload() +
                '}';
    }
}
