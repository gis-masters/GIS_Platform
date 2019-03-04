package ru.mycrg.gis.dto;

import ru.mycrg.common.ObjectValidationResult;
import ru.mycrg.common.ValidationMqResponse;
import ru.mycrg.common.enums.ProcessStatus;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class ValidationResponseDto {

    private String resourceId;
    private ProcessStatus status;
    private boolean isValidated;
    private long totalViolations;
    private String lastValidationDateTime;
    private List<ObjectValidationResult> objects = new ArrayList<>();

    public ValidationResponseDto() {}

    public ValidationResponseDto(Optional<ValidationMqResponse> mqResponseOptional) {
        mqResponseOptional.ifPresentOrElse(response -> {
            this.resourceId = response.getResourceId();
            this.status = response.getStatus();
            this.isValidated = response.isValidated();
            this.totalViolations = response.getTotal();
            this.lastValidationDateTime = response.getLastValidated();
            this.objects = response.getResults();
        }, () -> {
            this.status = ProcessStatus.ERROR;
        });
    }

    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public ProcessStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessStatus status) {
        this.status = status;
    }

    public boolean isValidated() {
        return isValidated;
    }

    public void setValidated(boolean validated) {
        isValidated = validated;
    }

    public long getTotalViolations() {
        return totalViolations;
    }

    public void setTotalViolations(long totalViolations) {
        this.totalViolations = totalViolations;
    }

    public String getLastValidationDateTime() {
        return lastValidationDateTime;
    }

    public void setLastValidationDateTime(String lastValidationDateTime) {
        this.lastValidationDateTime = lastValidationDateTime;
    }

    public List<ObjectValidationResult> getObjects() {
        return objects;
    }

    public void setObjects(List<ObjectValidationResult> objects) {
        this.objects = objects;
    }
}
