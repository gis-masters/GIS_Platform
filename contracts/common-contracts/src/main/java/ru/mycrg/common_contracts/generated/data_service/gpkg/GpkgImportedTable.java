package ru.mycrg.common_contracts.generated.data_service.gpkg;

import java.io.Serializable;

public class GpkgImportedTable extends GpkgImportBaseDto implements Serializable {

    private String dataset;
    private String oldTableIdentifier;
    private String createdTableIdentifier;

    public GpkgImportedTable() {
    }

    public String getDataset() {
        return dataset;
    }

    public void setDataset(String dataset) {
        this.dataset = dataset;
    }

    public String getOldTableIdentifier() {
        return oldTableIdentifier;
    }

    public void setOldTableIdentifier(String oldTableIdentifier) {
        this.oldTableIdentifier = oldTableIdentifier;
    }

    public String getCreatedTableIdentifier() {
        return createdTableIdentifier;
    }

    public void setCreatedTableIdentifier(String createdTableIdentifier) {
        this.createdTableIdentifier = createdTableIdentifier;
    }

    @Override
    public String toString() {
        return "{" +
                "\"dataset\":" + (dataset == null ? "null" : "\"" + dataset + "\"") + ", " +
                "\"createdTableIdentifier\":" + (createdTableIdentifier == null ? "null" : "\"" + createdTableIdentifier + "\"") + ", " +
                "\"oldTableIdentifier\":" + (oldTableIdentifier == null ? "null" : "\"" + oldTableIdentifier + "\"") + ", " +
                "\"name\":" + (getTitle() == null ? "null" : "\"" + getTitle() + "\"") + ", " +
                "\"status\":" + (getStatus() == null ? "null" : "\"" + getStatus() + "\"") + ", " +
                "\"messages\":" + (getMessages() == null ? "null" : "\"" + getMessages() + "\"") + ", " +
                "}";
    }
}
