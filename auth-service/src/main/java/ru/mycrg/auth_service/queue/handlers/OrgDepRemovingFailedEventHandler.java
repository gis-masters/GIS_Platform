package ru.mycrg.auth_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;
import ru.mycrg.auth_service_contract.events.response.OrganizationDependencyRemovingFailedEvent;
import ru.mycrg.messagebus_contract.IEventHandler;

@Service
public class OrgDepRemovingFailedEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(OrgDepRemovingFailedEventHandler.class);

    public OrgDepRemovingFailedEventHandler() {
        // Required
    }

    @Override
    public String getEventType() {
        return OrganizationDependencyRemovingFailedEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        final OrganizationDependencyRemovingFailedEvent event = (OrganizationDependencyRemovingFailedEvent) mqEvent;

        log.error("Failed remove dependencies of organization: {}", event.getOrgId());
    }
}
