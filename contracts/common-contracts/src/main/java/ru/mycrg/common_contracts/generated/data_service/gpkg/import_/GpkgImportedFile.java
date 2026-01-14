package ru.mycrg.common_contracts.generated.data_service.gpkg.import_;

import com.fasterxml.jackson.databind.JsonNode;

import java.io.Serializable;
import java.util.UUID;

public class GpkgImportedFile extends GpkgImportBaseDto implements Serializable {

    private UUID newId;
    private UUID oldId;
    private String tableName;
    private JsonNode resourceQualifier;

    public GpkgImportedFile() {
    }

    public GpkgImportedFile(UUID oldId, String tableName, GpkgProcessStatus status, String title) {
        this.oldId = oldId;
        this.tableName = tableName;
        setStatus(status);
        setTitle(title);
    }

    public UUID getNewId() {
        return newId;
    }

    public void setNewId(UUID newId) {
        this.newId = newId;
    }

    public UUID getOldId() {
        return oldId;
    }

    public void setOldId(UUID oldId) {
        this.oldId = oldId;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public JsonNode getResourceQualifier() {
        return resourceQualifier;
    }

    public void setResourceQualifier(JsonNode resourceQualifier) {
        this.resourceQualifier = resourceQualifier;
    }
}