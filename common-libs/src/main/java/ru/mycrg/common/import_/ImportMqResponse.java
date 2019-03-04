package ru.mycrg.common.import_;

import ru.mycrg.common.enums.ProcessStatus;

import java.util.UUID;

public class ImportMqResponse {

    private UUID id;
    private String layerName;
    private ProcessStatus status;

    public ImportMqResponse() {}

    public ImportMqResponse(UUID id, String tableName, ProcessStatus status) {
        this.id = id;
        this.layerName = tableName;
        this.status = status;
    }

    public String getLayerName() {
        return layerName;
    }

    public void setLayerName(String layerName) {
        this.layerName = layerName;
    }

    public ProcessStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessStatus status) {
        this.status = status;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }
}
