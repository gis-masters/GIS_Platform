package ru.mycrg.data_service_contract.queue.response;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusResponseEvent;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.messagebus_contract.MessageBusProperties.DELETE_GIS_REFERENCES_RES_QUEUE;

public class DeletionGisReferencesSucceededEvent extends DefaultMessageBusResponseEvent {

    private final String msg;

    public DeletionGisReferencesSucceededEvent() {
        super();

        this.msg = null;
    }

    public DeletionGisReferencesSucceededEvent(IMessageBusEvent event, String msg) {
        super(event, DELETE_GIS_REFERENCES_RES_QUEUE);

        this.msg = msg;
    }

    public String getMsg() {
        return msg;
    }
}
