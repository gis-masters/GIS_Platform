package ru.mycrg.data_service.service.parsers.model;

import java.util.ArrayList;
import java.util.List;

public class FeatureObject {

    private List<FeatureProperty> properties = new ArrayList<>();

    public FeatureObject() {
        // Required
    }

    public List<FeatureProperty> getProperties() {
        return properties;
    }

    public void setProperties(List<FeatureProperty> properties) {
        this.properties = properties;
    }
}
