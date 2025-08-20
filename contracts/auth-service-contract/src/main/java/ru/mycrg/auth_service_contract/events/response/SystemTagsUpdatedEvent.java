package ru.mycrg.auth_service_contract.events.response;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.DATA_TO_AUTH_EXCHANGE;
import static ru.mycrg.messagebus_contract.MessageBusProperties.SYSTEM_TAGS_UPDATED_ROUTING_KEY;

public class SystemTagsUpdatedEvent extends DefaultMessageBusRequestEvent {

    private final List<String> tags;

    public SystemTagsUpdatedEvent() {
        super();

        this.tags = new ArrayList<>();
    }

    public SystemTagsUpdatedEvent(List<String> tags) {
        super(UUID.randomUUID(), DATA_TO_AUTH_EXCHANGE, SYSTEM_TAGS_UPDATED_ROUTING_KEY);

        this.tags = tags;
    }

    public List<String> getTags() {
        return tags;
    }
}
