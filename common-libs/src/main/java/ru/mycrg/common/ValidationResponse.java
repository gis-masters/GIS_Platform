package ru.mycrg.common;

import ru.mycrg.common.enums.ValidationStatus;

import java.util.ArrayList;
import java.util.List;

public class ValidationResponse {

    private ValidationStatus status;
    private List<ConstraintViolation> violations = new ArrayList<>();

    public ValidationResponse() {}

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

    public void setStatus(ValidationStatus status) {
        this.status = status;
    }

    public List<ConstraintViolation> getViolations() {
        return violations;
    }

    public void setViolations(List<ConstraintViolation> violations) {
        this.violations = violations;
    }
}
