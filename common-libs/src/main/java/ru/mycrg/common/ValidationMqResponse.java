package ru.mycrg.common;

import ru.mycrg.common.enums.RequstType;
import ru.mycrg.common.enums.ValidationStatus;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ValidationMqResponse {

    private UUID id;
    private String resourceId;
    private Long total = 0L;
    private boolean isValidated;
    private String lastValidated;
    private ValidationStatus status;
    private RequstType requstType;
    private List<ObjectValidationResult> results = new ArrayList<>();

    public ValidationMqResponse() {}

    public ValidationMqResponse(ValidationMqRequest request) {
        this.id = request.getId();
        this.resourceId = String.join(":", request.getDbName(), request.getSchemaName(), request.getTableName());
    }

    public ValidationMqResponse(ValidationStatus status) {
        this.status = status;
    }

    public ValidationMqResponse(UUID id, ValidationStatus status) {
        this.id = id;
        this.status = status;
    }

    public ValidationMqResponse(ValidationStatus status, List<ObjectValidationResult> results) {
        this.status = status;
        this.results = results;
    }

    public boolean isDone() {
        return status == ValidationStatus.DONE;
    }

    public boolean isEmpty() {
        return status == ValidationStatus.EMPTY;
    }

    public boolean isError() {
        return status == ValidationStatus.ERROR;
    }

    public boolean isPending() {
        return status == ValidationStatus.PENDING;
    }

    public ValidationStatus getStatus() {
        return status;
    }

    public void setStatus(ValidationStatus status) {
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

    public RequstType getRequstType() {
        return requstType;
    }

    public void setRequstType(RequstType requstType) {
        this.requstType = requstType;
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
