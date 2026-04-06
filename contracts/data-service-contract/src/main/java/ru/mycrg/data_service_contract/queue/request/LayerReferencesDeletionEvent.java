package ru.mycrg.data_service_contract.queue.request;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.COMMON_REQUEST_QUEUE;

public class LayerReferencesDeletionEvent extends DefaultMessageBusRequestEvent {

    private String workspaceName;
    private String datasetName;
    private String resourceId;
    private String authToken;

    public LayerReferencesDeletionEvent() {
        super();
    }

    public LayerReferencesDeletionEvent(String workspaceName, String datasetName, String resourceId, String authToken) {
        super(UUID.randomUUID(), COMMON_REQUEST_QUEUE);

        this.resourceId = resourceId;
        this.authToken = authToken;
        this.datasetName = datasetName;
        this.workspaceName = workspaceName;
    }

    public String getWorkspaceName() {
        return workspaceName;
    }

    public void setWorkspaceName(String workspaceName) {
        this.workspaceName = workspaceName;
    }

    public String getDatasetName() {
        return datasetName;
    }

    public void setDatasetName(String datasetName) {
        this.datasetName = datasetName;
    }

    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public String getAuthToken() {
        return authToken;
    }

    public void setAuthToken(String authToken) {
        this.authToken = authToken;
    }
}
