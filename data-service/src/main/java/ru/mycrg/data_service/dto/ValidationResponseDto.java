package ru.mycrg.data_service.dto;

import ru.mycrg.mq_queue_contract.ObjectValidationResult;
import ru.mycrg.mq_queue_contract.enums.ProcessStatus;

import java.util.ArrayList;
import java.util.List;

public class ValidationResponseDto {

    Long total;
    boolean validated = false;
    String lastValidated;
    String error;
    List<ObjectValidationResult> results = new ArrayList<>();
    ProcessStatus status;

    public ValidationResponseDto() {
        // Framework required
    }

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }

    public boolean isValidated() {
        return validated;
    }

    public void setValidated(boolean validated) {
        this.validated = validated;
    }

    public String getLastValidated() {
        return lastValidated;
    }

    public void setLastValidated(String lastValidated) {
        this.lastValidated = lastValidated;
    }

    public List<ObjectValidationResult> getResults() {
        return results;
    }

    public void setResults(List<ObjectValidationResult> results) {
        this.results = results;
    }

    public ProcessStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessStatus status) {
        this.status = status;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}
