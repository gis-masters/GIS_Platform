package ru.mycrg.common.import_;

import ru.mycrg.common.FeatureDescriptionDto;
import ru.mycrg.common.ResourceProjection;

import java.util.List;

public class ImportMqTask {

    private FeatureDescriptionDto featureDescription;
    private ResourceProjection sourceResource;
    private ResourceProjection targetResource;
    private List<GeoMapping> mapping;

    public ImportMqTask() {}

    public ImportMqTask(FeatureDescriptionDto featureDescription,
                        ResourceProjection sourceResource,
                        ResourceProjection targetResource,
                        List<GeoMapping> mapping) {
        this.featureDescription = featureDescription;
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

    public FeatureDescriptionDto getFeatureDescription() {
        return featureDescription;
    }

    public void setFeatureDescription(FeatureDescriptionDto featureDescription) {
        this.featureDescription = featureDescription;
    }

}
