package ru.mycrg.common;

import java.util.ArrayList;
import java.util.List;

public class PropertyViolation {

    private String name;
    private Object value;
    private List<String> errors = new ArrayList<>();

    public PropertyViolation() {}

    public PropertyViolation(String name, Object value) {
        this.name = name;
        this.value = value;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }

    public boolean hasErrors() {
        return errors.size() > 0;
    }
}
