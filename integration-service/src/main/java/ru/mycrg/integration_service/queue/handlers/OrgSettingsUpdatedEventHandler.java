package ru.mycrg.integration_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.events.request.OrgSettingsUpdatedEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

@Service
public class OrgSettingsUpdatedEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(OrgSettingsUpdatedEventHandler.class);

    @Override
    public String getEventType() {
        return OrgSettingsUpdatedEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent event) {
        try {
            OrgSettingsUpdatedEvent mqEvent = (OrgSettingsUpdatedEvent) event;

            log.debug("Org. settings was updated: {}", mqEvent);
        } catch (Exception e) {
            String msg = "Failed to update service settings. Reason: {}";

            log.error(msg, e);
        }
    }
}
