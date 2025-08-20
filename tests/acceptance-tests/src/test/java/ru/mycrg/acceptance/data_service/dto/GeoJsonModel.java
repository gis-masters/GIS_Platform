package ru.mycrg.acceptance.data_service.dto;

import java.util.Map;

public class GeoJsonModel {

    private final String type = "Feature";
    private final Geometry geometry;

    private Map<String, Object> properties;

    public GeoJsonModel(Map<String, Object> properties) {
        this.geometry = new Geometry();
        this.properties = properties;
    }

    public String getType() {
        return type;
    }

    public Geometry getGeometry() {
        return geometry;
    }

    public Map<String, Object> getProperties() {
        return properties;
    }

    public void setProperties(Map<String, Object> properties) {
        this.properties = properties;
    }
}
