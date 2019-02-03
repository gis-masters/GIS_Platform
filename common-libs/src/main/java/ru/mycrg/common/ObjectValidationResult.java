package ru.mycrg.common;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

public class ObjectValidationResult {

    private String objectId;

    @JsonIgnore
    private String xMin;

    private List<PropertyViolation> violations = new ArrayList<>();
    private List<String> correctProperties = new ArrayList<>();
    private String violationAsString = "";

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

    public String getViolationAsString() {
        return violationAsString;
    }

    public void setViolationAsString(String violationAsString) {
        this.violationAsString = violationAsString;
    }

    public String getxMin() {
        return xMin;
    }

    public void setxMin(String xMin) {
        this.xMin = xMin;
    }
}
