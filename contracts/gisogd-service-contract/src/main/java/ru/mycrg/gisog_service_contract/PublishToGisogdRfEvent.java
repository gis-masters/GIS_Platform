package ru.mycrg.gisog_service_contract;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.Map;
import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.DATA_TO_GISOGD_QUEUE;

public class PublishToGisogdRfEvent extends DefaultMessageBusRequestEvent {

    private String token;

    private Map<String, Object> document;
    private Map<String, Object> inboxData;
    private Map<String, Object> layer;

    public PublishToGisogdRfEvent(String token,
                                  Map<String, Object> document,
                                  Map<String, Object> inboxData,
                                  Map<String, Object> layer) {
        super(UUID.randomUUID(), DATA_TO_GISOGD_QUEUE);

        this.token = token;
        this.document = document;
        this.inboxData = inboxData;
        this.layer = layer;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Map<String, Object> getInboxData() {
        return inboxData;
    }

    public void setInboxData(Map<String, Object> inboxData) {
        this.inboxData = inboxData;
    }

    public Map<String, Object> getDocument() {
        return document;
    }

    public void setDocument(Map<String, Object> document) {
        this.document = document;
    }

    public Map<String, Object> getLayer() {
        return layer;
    }

    public void setLayer(Map<String, Object> layer) {
        this.layer = layer;
    }
}
