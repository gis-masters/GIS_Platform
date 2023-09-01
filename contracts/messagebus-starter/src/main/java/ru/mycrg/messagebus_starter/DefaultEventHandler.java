package ru.mycrg.messagebus_starter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

public class DefaultEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(DefaultEventHandler.class);

    @Override
    public String getEventType() {
        return "default";
    }

    @Override
    public void handle(IMessageBusEvent event) {
        log.error("No any handlers for event: [{}] as class: [{}]", event, event.getClass());
    }
}
