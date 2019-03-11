package ru.mycrg.common;

import ru.mycrg.common.enums.ProcessStatus;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class GmlMqResponse {

    private UUID id;
    private String pathToFile;
    private ProcessStatus status;

    public GmlMqResponse() {}

    public GmlMqResponse(UUID id, ProcessStatus status) {
        this.id = id;
        this.status = status;
    }

    public GmlMqResponse(UUID id, String pathToFile, ProcessStatus status) {
        this.id = id;
        this.pathToFile = pathToFile;
        this.status = status;
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
}
