package ru.mycrg.common.import_;

import ru.mycrg.common.ResourceProjection;

import java.util.List;

public class ImportFeature {

    private ResourceProjection sourceResource;
    private ResourceProjection targetResource;
    private List<GeoMapping> mapping;

    public ImportFeature() {}

    public ImportFeature(ResourceProjection sourceResource,
                         ResourceProjection targetResource,
                         List<GeoMapping> mapping) {
        this.sourceResource = sourceResource;
        this.targetResource = targetResource;
        this.mapping = mapping;
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

    public String printSource() {
        return String.join(".", sourceResource.getDbName(), sourceResource.getSchemaName(), sourceResource.getTableName());
    }

    public String printTarget() {
        return String.join(".", targetResource.getDbName(), targetResource.getSchemaName(), targetResource.getTableName());
    }
}
