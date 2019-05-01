package ru.mycrg.common;

import ru.mycrg.common.enums.ProcessStatus;

import java.util.ArrayList;
import java.util.List;

public class ValidationMqResponse extends BaseMqProcessResponse {

    private Long total = 0L;
    private boolean isValidated;
    private String lastValidated;
    private List<ObjectValidationResult> results = new ArrayList<>();

    public ValidationMqResponse() {}

    public ValidationMqResponse(ValidationMqProcessRequest request, ProcessStatus status) {
        super(request.getId(), status, request.getType());
    }

    public ValidationMqResponse(ValidationMqProcessRequest request, ProcessStatus status, String msg, int progress) {
        super(request.getId(), status, request.getType(), progress, msg);
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

}
