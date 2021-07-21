package ru.mycrg.data_service.service.parsers.model;

import ru.mycrg.data_service_contract.enums.ValueType;

public class Property {

    private String name;

    private Object value;

    private ValueType type;

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

    public ValueType getType() {
        return type;
    }

    public void setType(ValueType type) {
        this.type = type;
    }
}
