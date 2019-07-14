package ru.mycrg.gis.dto;

public class SubProcessModel {

    private String layerName;
    private String description;
    private String error;

    public SubProcessModel() {}

    public SubProcessModel(String layerName, String description, String error) {
        this.layerName = layerName;
        this.description = description;
        this.error = error;
    }

    public String getLayerName() {
        return layerName;
    }

    public void setLayerName(String layerName) {
        this.layerName = layerName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

}
