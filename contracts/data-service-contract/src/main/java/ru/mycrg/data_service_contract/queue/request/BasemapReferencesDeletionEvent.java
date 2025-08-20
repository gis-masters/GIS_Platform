package ru.mycrg.data_service_contract.queue.request;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.COMMON_REQUEST_QUEUE;

public class BasemapReferencesDeletionEvent extends DefaultMessageBusRequestEvent {

    private final Long basemapId;
    private final String complexLayerName;
    private final String authToken;

    public BasemapReferencesDeletionEvent() {
        super();

        this.basemapId = null;
        this.authToken = null;
        this.complexLayerName = null;
    }

    public BasemapReferencesDeletionEvent(Long basemapId, String complexLayerName, String authToken) {
        super(UUID.randomUUID(), COMMON_REQUEST_QUEUE);

        this.basemapId = basemapId;
        this.authToken = authToken;
        this.complexLayerName = complexLayerName;
    }

    public Long getBasemapId() {
        return basemapId;
    }

    public String getAuthToken() {
        return authToken;
    }

    public String getComplexLayerName() {
        return complexLayerName;
    }
}
