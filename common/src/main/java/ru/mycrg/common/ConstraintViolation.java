package ru.mycrg.common;

import java.util.ArrayList;
import java.util.List;

public class ConstraintViolation {

    private String name;
    private String value;
    private List<String> violations = new ArrayList<>();

    public ConstraintViolation() {}

    public ConstraintViolation(String name, String value) {
        this.name = name;
        this.value = value;
    }

    public void addViolation(String msg) {
        this.violations.add(msg);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public List<String> getViolations() {
        return violations;
    }

}
