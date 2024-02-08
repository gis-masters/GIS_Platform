package ru.mycrg.data_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.events.request.OrgSettingsUpdatedEvent;
import ru.mycrg.data_service.service.OrgSettingsKeeper;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

@Service
public class OrgSettingsUpdatedEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(OrgSettingsUpdatedEventHandler.class);

    private final OrgSettingsKeeper orgSettingsKeeper;

    public OrgSettingsUpdatedEventHandler(OrgSettingsKeeper orgSettingsKeeper) {
        this.orgSettingsKeeper = orgSettingsKeeper;
    }

    @Override
    public String getEventType() {
        return OrgSettingsUpdatedEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent event) {
        try {
            OrgSettingsUpdatedEvent mqEvent = (OrgSettingsUpdatedEvent) event;

            orgSettingsKeeper.updateOrgSetting(mqEvent);

            log.debug("Org. settings was updated: {}", mqEvent);

            // В ответ отослать актуальные настройки по всем организациям
        } catch (Exception e) {
            log.error("Failed to update service settings. Reason: {}", e.getMessage(), e);
        }
    }
}
