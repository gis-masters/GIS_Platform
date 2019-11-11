package ru.mycrg.gis.service.import_;

import ru.mycrg.common.import_.MatchingPair;

import java.util.List;

/**
 * Соответствующая модель на ui -> portal-ui/src/app/services/geoserver/import/taskImport.ts
 */
public class ImportTask {

    private String layerName;
    private String workTableName;
    private List<MatchingPair> pairs;
    private Integer srs;
    private String schemaName;

    public ImportTask() {}

    public ImportTask(String layerName, String workTableName, List<MatchingPair> pairs) {
        this.layerName = layerName;
        this.workTableName = workTableName;
        this.pairs = pairs;
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

    public List<MatchingPair> getPairs() {
        return pairs;
    }

    public void setPairs(List<MatchingPair> pairs) {
        this.pairs = pairs;
    }

    public Integer getSrs() {
        return srs;
    }

    public void setSrs(Integer srs) {
        this.srs = srs;
    }

    public String getSchemaName() {
        return schemaName;
    }

    public void setSchemaName(String schemaName) {
        this.schemaName = schemaName;
    }
}
