package ru.mycrg.common.import_;

import ru.mycrg.common.ResourceProjection;

import java.util.List;
import java.util.UUID;

public class ImportMqRequest {

    private UUID id;
    private ResourceProjection sourceResource;
    private ResourceProjection targetResource;
    private List<GeoMapping> mapping;

    public ImportMqRequest() {}

    public ImportMqRequest(String dbName, String sourceSchema, String targetSchema,
                           String layerName, String workTableName, List<GeoMapping> mapping, UUID id) {
        this.mapping = mapping;
        this.sourceResource = new ResourceProjection(dbName, sourceSchema, layerName);
        this.targetResource = new ResourceProjection(dbName, targetSchema, workTableName);
        this.id = id;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public ResourceProjection getSourceResource() {
        return sourceResource;
    }

    public void setSourceResource(ResourceProjection sourceResource) {
        this.sourceResource = sourceResource;
    }

    public ResourceProjection getTargetResource() {
        return targetResource;
    }

    public void setTargetResource(ResourceProjection targetResource) {
        this.targetResource = targetResource;
    }

    public List<GeoMapping> getMapping() {
        return mapping;
    }

    public void setMapping(List<GeoMapping> mapping) {
        this.mapping = mapping;
    }

    public String sourceToString() {
        return sourceResource.getDbName() + "." + sourceResource.getSchemaName() + "." + sourceResource.getTableName();
    }

    public String targetToString() {
        return targetResource.getDbName() + "." + targetResource.getSchemaName() + "." + targetResource.getTableName();
    }

}
