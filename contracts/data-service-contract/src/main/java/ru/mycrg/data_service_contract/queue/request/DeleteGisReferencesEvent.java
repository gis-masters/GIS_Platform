package ru.mycrg.data_service_contract.queue.request;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.DELETE_GIS_REFERENCES_REQ_QUEUE;

public class DeleteGisReferencesEvent extends DefaultMessageBusRequestEvent {

    private final String msg;

    public DeleteGisReferencesEvent() {
        super();

        this.msg = null;
    }

    public DeleteGisReferencesEvent(String msg) {
        super(UUID.randomUUID(), DELETE_GIS_REFERENCES_REQ_QUEUE);

        this.msg = msg;
    }

    public String getMsg() {
        return msg;
    }
}
