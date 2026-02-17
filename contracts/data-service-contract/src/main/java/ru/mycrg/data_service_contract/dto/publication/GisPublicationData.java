package ru.mycrg.data_service_contract.dto.publication;

import java.io.Serializable;

public class GisPublicationData implements Serializable {

    private Long projectId;
    private Long parentId;
    private String sourceId;
    private String sourceType;
    private Long sourceRecordId;
    private String layerTitle;
    private String pathToFile;
    private String styleName;
    private String crs = "EPSG:7829";

    public GisPublicationData() {
        // Required
    }

    public GisPublicationData(Long projectId, String sourceId, String sourceType, Long sourceRecordId,
                              String layerTitle, String pathToFile, String styleName, String crs) {
        this.projectId = projectId;
        this.sourceId = sourceId;
        this.sourceType = sourceType;
        this.sourceRecordId = sourceRecordId;
        this.layerTitle = layerTitle;
        this.pathToFile = pathToFile;
        this.styleName = styleName;
        this.crs = crs;
    }

    public GisPublicationData(Long projectId, Long parentId, String sourceId, String sourceType, Long sourceRecordId,
                              String layerTitle, String pathToFile, String styleName, String crs) {
        this.projectId = projectId;
        this.parentId = parentId;
        this.sourceId = sourceId;
        this.sourceType = sourceType;
        this.sourceRecordId = sourceRecordId;
        this.layerTitle = layerTitle;
        this.pathToFile = pathToFile;
        this.styleName = styleName;
        this.crs = crs;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getSourceId() {
        return sourceId;
    }

    public void setSourceId(String sourceId) {
        this.sourceId = sourceId;
    }

    public Long getSourceRecordId() {
        return sourceRecordId;
    }

    public void setSourceRecordId(Long sourceRecordId) {
        this.sourceRecordId = sourceRecordId;
    }

    public String getLayerTitle() {
        return layerTitle;
    }

    public void setLayerTitle(String layerTitle) {
        this.layerTitle = layerTitle;
    }

    public String getPathToFile() {
        return pathToFile;
    }

    public void setPathToFile(String pathToFile) {
        this.pathToFile = pathToFile;
    }

    public String getStyleName() {
        return styleName;
    }

    public void setStyleName(String styleName) {
        this.styleName = styleName;
    }

    public String getSourceType() {
        return sourceType;
    }

    public void setSourceType(String sourceType) {
        this.sourceType = sourceType;
    }

    public String getCrs() {
        return crs;
    }

    public void setCrs(String crs) {
        this.crs = crs;
    }

    @Override
    public String toString() {
        return "{" +
                "\"projectId\":" + (projectId == null ? "null" : "\"" + projectId + "\"") + ", " +
                "\"parentId\":" + (parentId == null ? "null" : "\"" + parentId + "\"") + ", " +
                "\"sourceId\":" + (sourceId == null ? "null" : "\"" + sourceId + "\"") + ", " +
                "\"sourceType\":" + (sourceType == null ? "null" : "\"" + sourceType + "\"") + ", " +
                "\"sourceRecordId\":" + (sourceRecordId == null ? "null" : "\"" + sourceRecordId + "\"") + ", " +
                "\"layerTitle\":" + (layerTitle == null ? "null" : "\"" + layerTitle + "\"") + ", " +
                "\"pathToFile\":" + (pathToFile == null ? "null" : "\"" + pathToFile + "\"") + ", " +
                "\"styleName\":" + (styleName == null ? "null" : "\"" + styleName + "\"") + ", " +
                "\"crs\":" + (crs == null ? "null" : "\"" + crs + "\"") +
                "}";
    }
}
