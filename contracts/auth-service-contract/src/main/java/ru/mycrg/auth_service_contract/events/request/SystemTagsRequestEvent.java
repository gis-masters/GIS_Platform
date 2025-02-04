package ru.mycrg.auth_service_contract.events.request;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.*;

public class SystemTagsRequestEvent extends DefaultMessageBusRequestEvent {

    public SystemTagsRequestEvent() {
        super(UUID.randomUUID(), AUTH_TO_DATA_EXCHANGE, SYSTEM_TAGS_REQUEST_ROUTING_KEY);
    }
}
