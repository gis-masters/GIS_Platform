package ru.mycrg.common;

import ru.mycrg.common.enums.RequestType;
import ru.mycrg.common.enums.ProcessStatus;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ValidationMqResponse {

    private UUID id;
    private String resourceId;
    private Long total = 0L;
    private boolean isValidated;
    private String lastValidated;
    private ProcessStatus status;
    private RequestType requestType;
    private List<ObjectValidationResult> results = new ArrayList<>();

    public ValidationMqResponse() {}

    public ValidationMqResponse(ValidationMqRequest request) {
        this.id = request.getId();
        this.resourceId = String.join(":", request.getDbName(), request.getSchemaName(), request.getTableName());
    }

    public ValidationMqResponse(ValidationMqRequest request, ProcessStatus status) {
        this.id = request.getId();
        this.resourceId = String.join(":", request.getDbName(), request.getSchemaName(), request.getTableName());
        this.status = status;
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

    public ProcessStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessStatus status) {
        this.status = status;
    }

    public List<ObjectValidationResult> getResults() {
        return results;
    }

    public void setResults(List<ObjectValidationResult> results) {
        this.results = results;
    }

    public UUID getId() {
        return id;
    }

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }

    public boolean isValidated() {
        return isValidated;
    }

    public void setValidated(boolean validated) {
        isValidated = validated;
    }

    public String getLastValidated() {
        return lastValidated;
    }

    public void setLastValidated(String lastValidated) {
        this.lastValidated = lastValidated;
    }

    public RequestType getRequestType() {
        return requestType;
    }

    public void setRequestType(RequestType requestType) {
        this.requestType = requestType;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }
}
