package ru.mycrg.data_service_contract.dto.publication;

import java.io.Serializable;

public class GisPublicationData implements Serializable {

    private Long projectId;
    private String libraryId;
    private Long recordId;
    private String layerTitle;
    private String pathToFile;
    private String styleName;
    private String crs = "EPSG:7829";

    public GisPublicationData() {
        // Required
    }

    public GisPublicationData(Long projectId, String libraryId, Long recordId, String layerTitle, String pathToFile,
                              String styleName, String crs) {
        this.projectId = projectId;
        this.libraryId = libraryId;
        this.recordId = recordId;
        this.layerTitle = layerTitle;
        this.pathToFile = pathToFile;
        this.styleName = styleName;
        this.crs = crs;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getLibraryId() {
        return libraryId;
    }

    public void setLibraryId(String libraryId) {
        this.libraryId = libraryId;
    }

    public Long getRecordId() {
        return recordId;
    }

    public void setRecordId(Long recordId) {
        this.recordId = recordId;
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
                "\"libraryId\":" + (libraryId == null ? "null" : "\"" + libraryId + "\"") + ", " +
                "\"recordId\":" + (recordId == null ? "null" : "\"" + recordId + "\"") + ", " +
                "\"layerTitle\":" + (layerTitle == null ? "null" : "\"" + layerTitle + "\"") + ", " +
                "\"pathToFile\":" + (pathToFile == null ? "null" : "\"" + pathToFile + "\"") + ", " +
                "\"styleName\":" + (styleName == null ? "null" : "\"" + styleName + "\"") + ", " +
                "\"crs\":" + (crs == null ? "null" : "\"" + crs + "\"") +
                "}";
    }
}
