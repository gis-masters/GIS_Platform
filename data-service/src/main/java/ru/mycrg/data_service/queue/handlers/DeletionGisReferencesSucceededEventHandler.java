package ru.mycrg.data_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;
import ru.mycrg.data_service_contract.queue.response.DeletionGisReferencesSucceededEvent;
import ru.mycrg.messagebus_contract.IEventHandler;

@Service
public class DeletionGisReferencesSucceededEventHandler implements IEventHandler {

    public static final Logger log = LoggerFactory.getLogger(DeletionGisReferencesSucceededEventHandler.class);

    @Override
    public String getEventType() {
        return "DeletionGisReferencesSucceededEvent";
    }

    @Override
    public void handle(IMessageBusEvent busEvent) {
        DeletionGisReferencesSucceededEvent event = (DeletionGisReferencesSucceededEvent) busEvent;

        log.info("success back event: {}", event.getId());
    }
}
