package ru.mycrg.gisog_service_contract;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.messagebus_contract.MessageBusProperties.GISOGD_TO_DATA_QUEUE;

public class ResponseFromGisogdRfEvent extends DefaultMessageBusRequestEvent {

    public ResponseFromGisogdRfEvent(IMessageBusEvent event) {
        super(event.getId(), GISOGD_TO_DATA_QUEUE);
    }
}
