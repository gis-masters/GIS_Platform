package ru.mycrg.gis.service;

import java.util.List;

public class ImportTask {

    private String layerName;
    private String workTableName;
    private List<GeoMapping> mapping;

    public ImportTask() {}

    public ImportTask(String layerName, String workTableName, List<GeoMapping> mapping) {
        this.layerName = layerName;
        this.workTableName = workTableName;
        this.mapping = mapping;
    }

    public String getLayerName() {
        return layerName;
    }

    public void setLayerName(String layerName) {
        this.layerName = layerName;
    }

    public String getWorkTableName() {
        return workTableName;
    }

    public void setWorkTableName(String workTableName) {
        this.workTableName = workTableName;
    }

    public List<GeoMapping> getMapping() {
        return mapping;
    }

    public void setMapping(List<GeoMapping> mapping) {
        this.mapping = mapping;
    }
}
