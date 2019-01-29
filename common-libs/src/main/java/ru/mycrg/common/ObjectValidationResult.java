package ru.mycrg.common;

import java.util.ArrayList;
import java.util.List;

public class ObjectValidationResult {

    private String objectId;
    private List<PropertyViolation> violations = new ArrayList<>();
    private List<String> correctProperties = new ArrayList<>();

    public ObjectValidationResult() {}

    public void addPropertyViolation(PropertyViolation propertyViolation) {
        this.violations.add(propertyViolation);
    }

    public void addCorrectProperty(String name) {
        this.correctProperties.add(name);
    }

    public String getObjectId() {
        return objectId;
    }

    public void setObjectId(String objectId) {
        this.objectId = objectId;
    }

    public List<PropertyViolation> getViolations() {
        return violations;
    }

    public List<String> getCorrectProperties() {
        return correctProperties;
    }

}
