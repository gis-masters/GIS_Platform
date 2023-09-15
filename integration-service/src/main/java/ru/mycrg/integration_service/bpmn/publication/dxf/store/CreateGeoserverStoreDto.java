package ru.mycrg.integration_service.bpmn.publication.dxf.store;

import java.io.Serializable;

public class CreateGeoserverStoreDto implements Serializable {

    private String workspaceName;
    private String storeName;
    private String pathToFile;

    public CreateGeoserverStoreDto(String workspaceName, String storeName, String pathToFile) {
        this.workspaceName = workspaceName;
        this.storeName = storeName;
        this.pathToFile = pathToFile;
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

    public String getPathToFile() {
        return pathToFile;
    }

    public void setPathToFile(String pathToFile) {
        this.pathToFile = pathToFile;
    }

    @Override
    public String toString() {
        return "{" +
                "\"workspaceName\":" + (workspaceName == null ? "null" : "\"" + workspaceName + "\"") + ", " +
                "\"storeName\":" + (storeName == null ? "null" : "\"" + storeName + "\"") + ", " +
                "\"pathToFile\":" + (pathToFile == null ? "null" : "\"" + pathToFile + "\"") +
                "}";
    }
}
