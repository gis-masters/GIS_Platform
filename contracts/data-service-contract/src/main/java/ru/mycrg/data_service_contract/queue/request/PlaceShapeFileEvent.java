package ru.mycrg.data_service_contract.queue.request;

import ru.mycrg.data_service_contract.dto.ProcessModel;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.io.Serializable;
import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.DATA_TO_INTEGRATION_QUEUE;

public class PlaceShapeFileEvent extends DefaultMessageBusRequestEvent implements Serializable {

    private ProcessModel processModel;
    private UUID wsMsgId;
    private String wsUiId;

    private Long projectId;
    private String libraryId;
    private Long recordId;
    private String workspaceName;
    private String storeName;
    private String featureName;
    private String layerTitle;
    private String pathToFile;
    private String token;
    private String styleName;

    public PlaceShapeFileEvent() {
        super(UUID.randomUUID(), DATA_TO_INTEGRATION_QUEUE);
    }

    public PlaceShapeFileEvent(String token, ProcessModel processModel, UUID wsMsgId, String wsUiId,
                               Long projectId, String libraryId, Long recordId, String layerTitle,
                               String workspaceName, String storeName, String featureName, String pathToFile,
                               String styleName) {
        super(UUID.randomUUID(), DATA_TO_INTEGRATION_QUEUE);

        this.processModel = processModel;
        this.wsMsgId = wsMsgId;
        this.wsUiId = wsUiId;

        this.projectId = projectId;
        this.libraryId = libraryId;
        this.recordId = recordId;
        this.workspaceName = workspaceName;
        this.storeName = storeName;
        this.featureName = featureName;
        this.layerTitle = layerTitle;
        this.pathToFile = pathToFile;
        this.token = token;
        this.styleName = styleName;
    }

    public UUID getWsMsgId() {
        return wsMsgId;
    }

    public void setWsMsgId(UUID wsMsgId) {
        this.wsMsgId = wsMsgId;
    }

    public String getWsUiId() {
        return wsUiId;
    }

    public void setWsUiId(String wsUiId) {
        this.wsUiId = wsUiId;
    }

    public String getStoreName() {
        return storeName;
    }

    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }

    public String getFeatureName() {
        return featureName;
    }

    public void setFeatureName(String featureName) {
        this.featureName = featureName;
    }

    public String getPathToFile() {
        return pathToFile;
    }

    public void setPathToFile(String pathToFile) {
        this.pathToFile = pathToFile;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getWorkspaceName() {
        return workspaceName;
    }

    public void setWorkspaceName(String workspaceName) {
        this.workspaceName = workspaceName;
    }

    public String getLibraryId() {
        return libraryId;
    }

    public void setLibraryId(String libraryId) {
        this.libraryId = libraryId;
    }

    public Long getRecordId() {
        return recordId;
    }

    public void setRecordId(Long recordId) {
        this.recordId = recordId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public ProcessModel getProcessModel() {
        return processModel;
    }

    public void setProcessModel(ProcessModel processModel) {
        this.processModel = processModel;
    }

    public String getLayerTitle() {
        return layerTitle;
    }

    public void setLayerTitle(String layerTitle) {
        this.layerTitle = layerTitle;
    }

    public String getStyleName() {
        return styleName;
    }

    public void setStyleName(String styleName) {
        this.styleName = styleName;
    }

    @Override
    public String toString() {
        return "{" +
                "\"processModel\":" + (processModel == null ? "null" : processModel) + ", " +
                "\"wsMsgId\":" + (wsMsgId == null ? "null" : wsMsgId) + ", " +
                "\"wsUiId\":" + (wsUiId == null ? "null" : "\"" + wsUiId + "\"") + ", " +
                "\"projectId\":" + (projectId == null ? "null" : "\"" + projectId + "\"") + ", " +
                "\"libraryId\":" + (libraryId == null ? "null" : "\"" + libraryId + "\"") + ", " +
                "\"recordId\":" + (recordId == null ? "null" : "\"" + recordId + "\"") + ", " +
                "\"workspaceName\":" + (workspaceName == null ? "null" : "\"" + workspaceName + "\"") + ", " +
                "\"storeName\":" + (storeName == null ? "null" : "\"" + storeName + "\"") + ", " +
                "\"featureName\":" + (featureName == null ? "null" : "\"" + featureName + "\"") + ", " +
                "\"layerTitle\":" + (layerTitle == null ? "null" : "\"" + layerTitle + "\"") + ", " +
                "\"pathToFile\":" + (pathToFile == null ? "null" : "\"" + pathToFile + "\"") + ", " +
                "\"token\":" + (token == null ? "null" : "\"" + token + "\"") + ", " +
                "\"styleName\":" + (styleName == null ? "null" : "\"" + styleName + "\"") +
                "}";
    }
}
