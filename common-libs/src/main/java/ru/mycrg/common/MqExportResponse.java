package ru.mycrg.common;

public class MqExportResponse {

    private String layerName;
    private String pathToFile;

    public MqExportResponse() {}

    public MqExportResponse(String layerName) {
        this.layerName = layerName;
    }

    public MqExportResponse(String pathToFile, String layerName) {
        this.layerName = layerName;
        this.pathToFile = pathToFile;
    }

    public String getPathToFile() {
        return pathToFile;
    }

    public void setPathToFile(String pathToFile) {
        this.pathToFile = pathToFile;
    }

    public String getLayerName() {
        return layerName;
    }

    public void setLayerName(String layerName) {
        this.layerName = layerName;
    }

}
