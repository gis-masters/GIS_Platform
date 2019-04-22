package ru.mycrg.common;

import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.common.enums.RequestType;

import java.util.ArrayList;
import java.util.List;

public class ValidationMqResponse extends BaseMqProcessResponse {

    private String resourceId;
    private Long total = 0L;
    private boolean isValidated;
    private String lastValidated;
    private RequestType requestType;
    private List<ObjectValidationResult> results = new ArrayList<>();

    public ValidationMqResponse() {}

    public ValidationMqResponse(ValidationMqRequest request) {
        this.setId(request.getId());

        this.resourceId = String.join(":", request.getDbName(), request.getSchemaName(), request.getTableName());
    }

    public ValidationMqResponse(ValidationMqRequest request, ProcessStatus status) {
        this.setId(request.getId());
        this.setStatus(status);

        this.resourceId = String.join(":", request.getDbName(), request.getSchemaName(), request.getTableName());
    }

    public List<ObjectValidationResult> getResults() {
        return results;
    }

    public void setResults(List<ObjectValidationResult> results) {
        this.results = results;
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

    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }
}
