package ru.mycrg.common;

import java.util.ArrayList;
import java.util.List;

public class ConstraintViolation {

    private String id;
    private List<PropertyViolation> propertyViolations = new ArrayList<>();

    public ConstraintViolation() {}

    public ConstraintViolation(String id) {
        this.id = id;
    }

    public void addPropertyViolation(PropertyViolation propertyViolation) {
        this.propertyViolations.add(propertyViolation);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<PropertyViolation> getPropertyViolations() {
        return propertyViolations;
    }
}
