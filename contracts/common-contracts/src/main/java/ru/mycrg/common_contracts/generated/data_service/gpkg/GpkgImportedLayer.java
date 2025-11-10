package ru.mycrg.common_contracts.generated.data_service.gpkg;

import java.io.Serializable;

public class GpkgImportedLayer extends GpkgImportBaseDto implements Serializable {

    private Long createdTableId;
    private String styleName;

    public GpkgImportedLayer() {
    }

    public Long getCreatedTableId() {
        return createdTableId;
    }

    public void setCreatedTableId(Long createdTableId) {
        this.createdTableId = createdTableId;
    }

    public String getStyleName() {
        return styleName;
    }

    public void setStyleName(String styleName) {
        this.styleName = styleName;
    }

    @Override
    public String toString() {
        return "{" +
                "\"createdTableId\":" + (createdTableId == null ? "null" : "\"" + createdTableId + "\"") + ", " +
                "\"styleName\":" + (styleName == null ? "null" : "\"" + styleName + "\"") + ", " +
                "\"name\":" + (getTitle() == null ? "null" : "\"" + getTitle() + "\"") + ", " +
                "\"status\":" + (getStatus() == null ? "null" : "\"" + getStatus() + "\"") + ", " +
                "\"messages\":" + (getMessages() == null ? "null" : "\"" + getMessages() + "\"") + ", " +
                "}";
    }
}
