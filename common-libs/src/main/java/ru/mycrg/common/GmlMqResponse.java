package ru.mycrg.common;

import ru.mycrg.common.enums.ProcessStatus;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class GmlMqResponse {

    private UUID id;
    private String pathToFile;
    private String pathToLog;
    private ProcessStatus status;
    private String description;

    public GmlMqResponse() {}

    public GmlMqResponse(UUID id, Map<String, String> paths, ProcessStatus status) {
        this.id = id;
        this.status = status;
        this.pathToFile = paths.get("gml");
        this.pathToLog = paths.get("log");
    }

    public GmlMqResponse(UUID id, ProcessStatus status, String description) {
        this.id = id;
        this.status = status;
        this.description = description;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getPathToFile() {
        return pathToFile;
    }

    public void setPathToFile(String pathToFile) {
        this.pathToFile = pathToFile;
    }

    public ProcessStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessStatus status) {
        this.status = status;
    }

    public String getPathToLog() {
        return pathToLog;
    }

    public void setPathToLog(String pathToLog) {
        this.pathToLog = pathToLog;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
