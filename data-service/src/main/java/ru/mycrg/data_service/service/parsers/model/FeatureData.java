package ru.mycrg.data_service.service.parsers.model;

import java.util.List;

public class FeatureData {

    private String name;
    private List<FeatureObject> featureObjects;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<FeatureObject> getObjects() {
        return featureObjects;
    }

    public void setObjects(List<FeatureObject> featureObjects) {
        this.featureObjects = featureObjects;
    }
}
