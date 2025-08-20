package ru.mycrg.data_service_contract.dto;

import java.util.ArrayList;
import java.util.List;

public class PropertyViolation {

    private String name;
    private Object value;
    private List<String> errorTypes = new ArrayList<>();

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

    public List<String> getErrorTypes() {
        return errorTypes;
    }

    public void setErrorTypes(List<String> errorTypes) {
        this.errorTypes = errorTypes;
    }

    public boolean hasErrors() {
        return !errorTypes.isEmpty();
    }
}
