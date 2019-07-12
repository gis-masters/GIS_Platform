package ru.mycrg.common.import_;

import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.enums.ProcessStatus;

public class ImportMqResponse extends BaseMqProcessResponse {

    private String targetLayer;
    private String sourceLayer;

    public ImportMqResponse() {}

    public ImportMqResponse(ImportMqRequest request, ProcessStatus status, String description, String error) {
        super(request.getId(), status, request.getType(), description, error);
    }

    public ImportMqResponse(ImportMqRequest request, ProcessStatus status, String description, int progress) {
        super(request.getId(), status, request.getType(), description, progress);
    }

    public ImportMqResponse(ImportFeature importFeature, ImportMqRequest request, ProcessStatus status,
                            String description) {
        super(request.getId(), status, request.getType(), description);

        this.targetLayer = importFeature.getTargetResource().getTableName();
        this.sourceLayer = importFeature.getSourceResource().getTableName();
    }

    public ImportMqResponse(ImportFeature importFeature, ImportMqRequest request, ProcessStatus status,
                            String description, String error) {
        super(request.getId(), status, request.getType(), description, error);

        this.targetLayer = importFeature.getTargetResource().getTableName();
        this.sourceLayer = importFeature.getSourceResource().getTableName();
    }

    public String getDirection() {
        return sourceLayer + " -> " + targetLayer;
    }

    public String getTargetLayer() {
        return targetLayer;
    }

    public void setTargetLayer(String targetLayer) {
        this.targetLayer = targetLayer;
    }

    public String getSourceLayer() {
        return sourceLayer;
    }

    public void setSourceLayer(String sourceLayer) {
        this.sourceLayer = sourceLayer;
    }
}
