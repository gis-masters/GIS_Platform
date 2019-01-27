package ru.mycrg.common;

import ru.mycrg.common.enums.ValidationStatus;

import java.util.ArrayList;
import java.util.List;

public class ValidationResponse {

    private String tableName;
    private ValidationStatus status;
    private List<ConstraintViolation> violations = new ArrayList<>();

    public ValidationResponse() {}

    public ValidationResponse(String tableName) {
        this.tableName = tableName;
    }

    public ValidationResponse(ValidationStatus status) {
        this.status = status;
    }

    public ValidationResponse(ValidationStatus status, List<ConstraintViolation> violations) {
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

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }
}
