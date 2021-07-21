package ru.mycrg.data_service.service.parsers.model;

import java.util.List;

public class SchemaProperties {

    private String name;
    private List<List<Property>> objects;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<List<Property>> getObjects() {
        return objects;
    }

    public void setObjects(List<List<Property>> objects) {
        this.objects = objects;
    }
}
