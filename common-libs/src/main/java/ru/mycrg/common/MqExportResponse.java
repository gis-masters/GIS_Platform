package ru.mycrg.common;

import ru.mycrg.common.enums.ProcessStatus;

public class MqExportResponse extends BaseMqProcessResponse {

    private String pathToFile;
    private String layerName;

    public MqExportResponse() {}

    public MqExportResponse(MqExportProcessRequest request, String pathToResource, ProcessStatus status,
                            int percentOfProgress) {
        super(request.getId(), status, request.getType(), "Завершено", percentOfProgress);

        this.pathToFile = pathToResource;
    }

    public MqExportResponse(MqExportProcessRequest request, ProcessStatus status, String description, int percentOfProgress) {
        super(request.getId(), status, request.getType(), description, percentOfProgress);
    }

    public MqExportResponse(String layerName, MqExportProcessRequest request, ProcessStatus status, String description,
                            int percentOfProgress) {
        super(request.getId(), status, request.getType(), description, percentOfProgress);

        this.layerName = layerName;
    }

    public MqExportResponse(MqExportProcessRequest request, ProcessStatus status, String description,
                            int percentOfProgress, String error) {
        super(request.getId(), status, request.getType(), description, error, percentOfProgress);
    }

    public MqExportResponse(String layerName, MqExportProcessRequest request, ProcessStatus status, String description,
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

    public String getLayerName() {
        return layerName;
    }

    public void setLayerName(String layerName) {
        this.layerName = layerName;
    }
}
