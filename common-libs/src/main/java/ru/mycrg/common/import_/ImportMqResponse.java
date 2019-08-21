package ru.mycrg.common.import_;

public class ImportMqResponse {

    private String targetLayer;
    private String sourceLayer;

    public ImportMqResponse() {}

    public ImportMqResponse(ImportFeature importFeature) {
        this.targetLayer = importFeature.getTargetResource().getTableName();
        this.sourceLayer = importFeature.getSourceResource().getTableName();
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
