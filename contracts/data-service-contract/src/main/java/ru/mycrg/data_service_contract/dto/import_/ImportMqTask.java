package ru.mycrg.data_service_contract.dto.import_;

import ru.mycrg.data_service_contract.dto.ResourceProjection;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.List;

public class ImportMqTask {

    private String layerName;
    private String styleName;
    private String workspaceName;
    private long projectId;
    private SchemaDto featureDescription;
    private ResourceProjection sourceResource;
    private ResourceProjection targetResource;
    private List<MatchingPair> pairs;
    private Integer srs;
    private String rootToken;
    private String userToken;

    public ImportMqTask() {}

    public ImportMqTask(String layerName,
                        String styleName,
                        String workspaceName,
                        long projectId,
                        SchemaDto featureDescription,
                        ResourceProjection sourceResource,
                        ResourceProjection targetResource,
                        List<MatchingPair> pairs,
                        Integer srs,
                        String rootToken,
                        String userToken) {
        this.layerName = layerName;
        this.styleName = styleName;
        this.workspaceName = workspaceName;
        this.projectId = projectId;
        this.featureDescription = featureDescription;
        this.sourceResource = sourceResource;
        this.targetResource = targetResource;
        this.pairs = pairs;
        this.srs = srs;
        this.rootToken = rootToken;
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

    public SchemaDto getFeatureDescription() {
        return featureDescription;
    }

    public void setFeatureDescription(SchemaDto featureDescription) {
        this.featureDescription = featureDescription;
    }

    public Integer getSrs() {
        return srs;
    }

    public void setSrs(Integer srs) {
        this.srs = srs;
    }

    public String getRootToken() {
        return rootToken;
    }

    public void setRootToken(String rootToken) {
        this.rootToken = rootToken;
    }

    public long getProjectId() {
        return projectId;
    }

    public void setProjectId(long projectId) {
        this.projectId = projectId;
    }

    public String getLayerName() {
        return layerName;
    }

    public void setLayerName(String layerName) {
        this.layerName = layerName;
    }

    public String getStyleName() {
        return styleName;
    }

    public void setStyleName(String styleName) {
        this.styleName = styleName;
    }

    public String getWorkspaceName() {
        return workspaceName;
    }

    public void setWorkspaceName(String workspaceName) {
        this.workspaceName = workspaceName;
    }

    public String getUserToken() {
        return userToken;
    }
}
