package ru.mycrg.common.import_;

import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.enums.ProcessStatus;

import java.util.UUID;

public class ImportMqResponse extends BaseMqProcessResponse {

    private String layerName;

    public ImportMqResponse() {}

    public ImportMqResponse(UUID id, ProcessStatus status) {
        super(id, status);
    }

    public ImportMqResponse(UUID id, String tableName, ProcessStatus status) {
        super(id, status);

        this.layerName = tableName;
    }

    public ImportMqResponse(UUID id, String layerName, ProcessStatus status, int progress) {
        super(id, status, "", progress);

        this.layerName = layerName;
    }

    public String getLayerName() {
        return layerName;
    }

    public void setLayerName(String layerName) {
        this.layerName = layerName;
    }

}
