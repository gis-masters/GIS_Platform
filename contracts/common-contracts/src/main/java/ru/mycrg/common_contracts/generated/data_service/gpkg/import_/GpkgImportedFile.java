package ru.mycrg.common_contracts.generated.data_service.gpkg.import_;

import com.fasterxml.jackson.databind.JsonNode;

import java.io.Serializable;
import java.util.UUID;

// TODO: сделать чтобы кто-то наполнял эту DTO сейчас мы не умеем импортировать файлы
public class GpkgImportedFile extends GpkgImportBaseDto implements Serializable {

    private UUID newId;
    private UUID oldId;
    private String path;
    private JsonNode resourceQualifier;

    public GpkgImportedFile() {
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

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public JsonNode getResourceQualifier() {
        return resourceQualifier;
    }

    public void setResourceQualifier(JsonNode resourceQualifier) {
        this.resourceQualifier = resourceQualifier;
    }
}