package ru.mycrg.gis.service.import_;

import ru.mycrg.common.import_.GeoMapping;

import java.util.List;

/**
 * Соответствующая модель на ui -> portal-ui/src/app/services/geoserver/import/taskImport.ts
 */
public class ImportTask {

    private String layerName;
    private String workTableName;
    private List<GeoMapping> mapping;
    private Integer srs;

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

    public Integer getSrs() {
        return srs;
    }

    public void setSrs(Integer srs) {
        this.srs = srs;
    }
}
