package ru.mycrg.common;

import ru.mycrg.common.enums.ValidationStatus;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ValidationMqResponse {

    private UUID id;
    private int batchNumber = 0;
    private ValidationStatus status;
    private List<ConstraintViolation> violations = new ArrayList<>();

    public ValidationMqResponse() {}

    public ValidationMqResponse(UUID id) {
        this.id = id;
    }

    public ValidationMqResponse(ValidationStatus status) {
        this.status = status;
    }

    public ValidationMqResponse(ValidationStatus status, List<ConstraintViolation> violations) {
        this.status = status;
        this.violations = violations;
    }

    public boolean isDone() {
        return status == ValidationStatus.DONE;
    }

    public boolean isEmpty() {
        return status == ValidationStatus.EMPTY;
    }

    public boolean isError() {
        return status == ValidationStatus.EMPTY;
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

    public List<ConstraintViolation> getViolations() {
        return violations;
    }

    public void setViolations(List<ConstraintViolation> violations) {
        this.violations = violations;
    }

    public UUID getId() {
        return id;
    }

    public void setBatchNumber(int batchNumber) {
        this.batchNumber = batchNumber;
    }

    public int getBatchNumber() {
        return batchNumber;
    }

}
