package ru.mycrg.data_service.dto;

import ru.mycrg.data_service_contract.enums.ProcessStatus;

public class ValidationInfo {

    private String featureName;
    private ProcessStatus status;
    private boolean isValidated;
    private long totalViolations;
    private String lastValidationDateTime;

    public ValidationInfo() {}

    public ValidationInfo(String featureName) {
        this.featureName = featureName;
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

    public String getFeatureName() {
        return featureName;
    }

    public void setFeatureName(String featureName) {
        this.featureName = featureName;
    }
}
