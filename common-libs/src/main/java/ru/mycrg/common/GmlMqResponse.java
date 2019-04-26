package ru.mycrg.common;

import ru.mycrg.common.enums.ProcessStatus;

import java.util.Map;

public class GmlMqResponse extends BaseMqProcessResponse {

    private String pathToFile;
    private String pathToLog;

    public GmlMqResponse() {}

    public GmlMqResponse(GmlMqProcessRequest request, Map<String, String> paths, ProcessStatus status, int percentOfProgress) {
        this.setId(request.getId());
        this.setStatus(status);
        this.setProgress(percentOfProgress);

        this.pathToFile = paths.get("gml");
        this.pathToLog = paths.get("log");
    }

    public GmlMqResponse(GmlMqProcessRequest request, ProcessStatus status, String description, int percentOfProgress) {
        super(request.getId(), status, description, percentOfProgress);
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

}
