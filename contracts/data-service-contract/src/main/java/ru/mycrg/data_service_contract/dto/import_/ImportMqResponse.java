package ru.mycrg.data_service_contract.dto.import_;

public class ImportMqResponse {

    private String targetLayer;
    private String sourceLayer;

    public ImportMqResponse() {}

    public ImportMqResponse(ImportMqTask importMqTask) {
        this.targetLayer = importMqTask.getTargetResource().getTableName();
        this.sourceLayer = importMqTask.getSourceResource().getTableName();
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
