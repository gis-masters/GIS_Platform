package ru.mycrg.data_service_contract.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class FgisTpDocument {

    private String title;
    private List<String> objectCollection;
    private List<String> specialZoneCollection;

    public FgisTpDocument(String title, List<String> objectCollection) {
        this(title, objectCollection, new ArrayList<>());
    }

    public FgisTpDocument(String title, List<String> objectCollection, List<String> specialZoneCollection) {
        this.title = title;
        this.objectCollection = objectCollection;
        this.specialZoneCollection = specialZoneCollection;
    }

    public List<String> getAll() {
        return Stream.concat(objectCollection.stream(), specialZoneCollection.stream())
                     .collect(Collectors.toList());
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getObjectCollection() {
        return objectCollection;
    }

    public void setObjectCollection(List<String> objectCollection) {
        this.objectCollection = objectCollection;
    }

    public List<String> getSpecialZoneCollection() {
        return specialZoneCollection;
    }

    public void setSpecialZoneCollection(List<String> specialZoneCollection) {
        this.specialZoneCollection = specialZoneCollection;
    }
}
