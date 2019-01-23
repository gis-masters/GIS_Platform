package ru.mycrg.common;

import java.util.ArrayList;
import java.util.List;

public class PropertyViolation {

    private String name;
    private String value;
    private List<String> errors = new ArrayList<>();

    public PropertyViolation() {}

    public PropertyViolation(String name, String value) {
        this.name = name;
        this.value = value;
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

    public List<String> getErrors() {
        return errors;
    }

    public void addError(String msg) {
        errors.add(msg);
    }

    public boolean hasErrors() {
        return errors.size() > 0;
    }
}
