package ru.mycrg.data_service_contract.queue.request;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.COMMON_REQUEST_QUEUE;

public class LayerReferencesDeletionEvent extends DefaultMessageBusRequestEvent {

    private final String workspaceName;
    private final String datasetName;
    private final String tableName;
    private final String authToken;

    public LayerReferencesDeletionEvent() {
        super();

        this.tableName = null;
        this.authToken = null;
        this.datasetName = null;
        this.workspaceName = null;
    }

    public LayerReferencesDeletionEvent(String workspaceName, String datasetName, String tableName, String authToken) {
        super(UUID.randomUUID(), COMMON_REQUEST_QUEUE);

        this.tableName = tableName;
        this.authToken = authToken;
        this.datasetName = datasetName;
        this.workspaceName = workspaceName;
    }

    public String getTableName() {
        return tableName;
    }

    public String getAuthToken() {
        return authToken;
    }

    public String getWorkspaceName() {
        return workspaceName;
    }

    public String getDatasetName() {
        return datasetName;
    }
}
