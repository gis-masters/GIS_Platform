package ru.mycrg.common;

import ru.mycrg.common.enums.ProcessStatus;

import java.util.Map;

public class GmlMqResponse extends BaseMqProcessResponse {

    private String pathToFile;
    private String pathToLog;
    private String layerName;

    public GmlMqResponse() {}

    public GmlMqResponse(GmlMqProcessRequest request, Map<String, String> paths, ProcessStatus status, int percentOfProgress) {
        super(request.getId(), status, request.getType(), "Завершено", percentOfProgress);

        this.pathToFile = paths.get("gml");
        this.pathToLog = paths.get("log");
    }

    public GmlMqResponse(GmlMqProcessRequest request, ProcessStatus status, String description, int percentOfProgress) {
        super(request.getId(), status, request.getType(), description, percentOfProgress);
    }

    public GmlMqResponse(String layerName, GmlMqProcessRequest request, ProcessStatus status, String description,
                         int percentOfProgress) {
        super(request.getId(), status, request.getType(), description, percentOfProgress);

        this.layerName = layerName;
    }

    public GmlMqResponse(GmlMqProcessRequest request, ProcessStatus status, String description,
                         int percentOfProgress, String error) {
        super(request.getId(), status, request.getType(), description, error, percentOfProgress);
    }

    public GmlMqResponse(String layerName, GmlMqProcessRequest request, ProcessStatus status, String description,
                         int percentOfProgress, String error) {
        super(request.getId(), status, request.getType(), description, error, percentOfProgress);

        this.layerName = layerName;
    }

    public String getPathToFile() {
        return pathToFile;
    }

    public void setPathToFile(String pathToFile) {
        this.pathToFile = pathToFile;
    }

    public String getPathToLog() {
        return pathToLog;
    }

    public void setPathToLog(String pathToLog) {
        this.pathToLog = pathToLog;
    }

    public String getLayerName() {
        return layerName;
    }

    public void setLayerName(String layerName) {
        this.layerName = layerName;
    }
}
