package ru.mycrg.integration_service.bpmn.fiz.geoserver_feature;

import java.io.Serializable;

public class CreateFeatureDto implements Serializable {

    private String featureName;
    private String workspaceName;
    private String storeName;

    public CreateFeatureDto(String featureName, String workspaceName, String storeName) {
        this.featureName = featureName;
        this.workspaceName = workspaceName;
        this.storeName = storeName;
    }

    public String getFeatureName() {
        return featureName;
    }

    public void setFeatureName(String featureName) {
        this.featureName = featureName;
    }

    public String getWorkspaceName() {
        return workspaceName;
    }

    public void setWorkspaceName(String workspaceName) {
        this.workspaceName = workspaceName;
    }

    public String getStoreName() {
        return storeName;
    }

    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }

    @Override
    public String toString() {
        return "{" +
                "\"featureName\":" + (featureName == null ? "null" : "\"" + featureName + "\"") + ", " +
                "\"workspaceName\":" + (workspaceName == null ? "null" : "\"" + workspaceName + "\"") + ", " +
                "\"storeName\":" + (storeName == null ? "null" : "\"" + storeName + "\"") +
                "}";
    }
}
