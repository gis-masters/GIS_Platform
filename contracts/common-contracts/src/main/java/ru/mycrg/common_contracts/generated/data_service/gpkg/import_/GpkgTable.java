package ru.mycrg.common_contracts.generated.data_service.gpkg.import_;

import java.io.Serializable;

public class GpkgTable extends GpkgReportBaseDto implements Serializable {

    private String dataset;
    private String oldTableIdentifier;
    private String createdTableIdentifier;
    private Long importedObjects;
    private Long failedObjects;

    public GpkgTable() {
    }

    public GpkgTable(GpkgProcessStatus status, String dataset, String identifier) {
        super(status);

        this.dataset = dataset;
        this.oldTableIdentifier = identifier;
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

    public Long getImportedObjects() {
        return importedObjects;
    }

    public void setImportedObjects(Long importedObjects) {
        this.importedObjects = importedObjects;
    }

    public Long getFailedObjects() {
        return failedObjects;
    }

    public void setFailedObjects(Long failedObjects) {
        this.failedObjects = failedObjects;
    }

    @Override
    public String toString() {
        return "{" +
                "\"dataset\":" + (dataset == null ? "null" : "\"" + dataset + "\"") + ", " +
                "\"createdTableIdentifier\":" + (createdTableIdentifier == null ? "null" : "\"" + createdTableIdentifier + "\"") + ", " +
                "\"oldTableIdentifier\":" + (oldTableIdentifier == null ? "null" : "\"" + oldTableIdentifier + "\"") + ", " +
                "\"importedObjects\":" + (importedObjects == null ? "null" : "\"" + importedObjects + "\"") + ", " +
                "\"failedObjects\":" + (failedObjects == null ? "null" : "\"" + failedObjects + "\"") + ", " +
                "\"title\":" + (getTitle() == null ? "null" : "\"" + getTitle() + "\"") + ", " +
                "\"status\":" + (getStatus() == null ? "null" : "\"" + getStatus() + "\"") + ", " +
                "\"messages\":" + (getMessages() == null ? "null" : "\"" + getMessages() + "\"") + ", " +
                "}";
    }
}
