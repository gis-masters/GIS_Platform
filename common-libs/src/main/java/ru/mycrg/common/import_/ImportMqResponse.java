package ru.mycrg.common.import_;

import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.enums.ProcessStatus;

public class ImportMqResponse extends BaseMqProcessResponse {

    private String layerName;

    public ImportMqResponse(ImportMqRequest request, ProcessStatus status) {
        super(request.getId(), status, request.getType());
    }

    public ImportMqResponse(ImportMqRequest request, ProcessStatus status, String description, int progress) {
        super(request.getId(), status, request.getType(), description, progress);
    }

    public ImportMqResponse(ImportMqRequest request, ProcessStatus status, String layerName) {
        super(request.getId(), status, request.getType());

        this.layerName = layerName;
    }

    public String getLayerName() {
        return layerName;
    }

    public void setLayerName(String layerName) {
        this.layerName = layerName;
    }

}
