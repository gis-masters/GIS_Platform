package ru.mycrg.common;

import java.util.ArrayList;
import java.util.List;

public class ValidationResponse {

    private boolean done;

    private List<ConstraintViolation> violations = new ArrayList<>();

    public ValidationResponse() {}

    public ValidationResponse(boolean done, List<ConstraintViolation> violations) {
        this.done = done;
        this.violations = violations;
    }

    public boolean isDone() {
        return done;
    }

    public void setDone(boolean done) {
        this.done = done;
    }

    public List<ConstraintViolation> getViolations() {
        return violations;
    }

    public void setViolations(List<ConstraintViolation> violations) {
        this.violations = violations;
    }
}
