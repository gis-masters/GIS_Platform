package ru.mycrg.mq_queue_contract.import_;

import ru.mycrg.mq_queue_contract.FeatureDescriptionDto;
import ru.mycrg.mq_queue_contract.ResourceProjection;

import java.util.List;

public class ImportMqTask {

    private FeatureDescriptionDto featureDescription;
    private ResourceProjection sourceResource;
    private ResourceProjection targetResource;
    private List<MatchingPair> pairs;
    private Integer srs;
    private String userToken;

    public ImportMqTask() {}

    public ImportMqTask(FeatureDescriptionDto featureDescription,
                        ResourceProjection sourceResource,
                        ResourceProjection targetResource,
                        List<MatchingPair> pairs,
                        Integer srs,
                        String userToken) {
        this.featureDescription = featureDescription;
        this.sourceResource = sourceResource;
        this.targetResource = targetResource;
        this.pairs = pairs;
        this.srs = srs;
        this.userToken = userToken;
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

    public List<MatchingPair> getPairs() {
        return pairs;
    }

    public void setPairs(List<MatchingPair> pairs) {
        this.pairs = pairs;
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

    public Integer getSrs() {
        return srs;
    }

    public void setSrs(Integer srs) {
        this.srs = srs;
    }

    public String getUserToken() {
        return userToken;
    }

    public void setUserToken(String userToken) {
        this.userToken = userToken;
    }
}
