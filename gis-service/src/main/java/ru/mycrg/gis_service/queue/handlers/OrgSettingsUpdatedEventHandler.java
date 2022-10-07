package ru.mycrg.gis_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.events.request.OrgSettingsUpdatedEvent;
import ru.mycrg.gis_service.security.OrgSettingsKeeper;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.util.Map;

@Service
public class OrgSettingsUpdatedEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(OrgSettingsUpdatedEventHandler.class);

    private final OrgSettingsKeeper settingsKeeper;

    public OrgSettingsUpdatedEventHandler(OrgSettingsKeeper settingsKeeper) {
        this.settingsKeeper = settingsKeeper;
    }

    @Override
    public String getEventType() {
        return "OrgSettingsUpdatedEvent";
    }

    @Override
    public void handle(IMessageBusEvent event) {
        try {
            OrgSettingsUpdatedEvent mqEvent = (OrgSettingsUpdatedEvent) event;
            Map<String, Object> settings = mqEvent.getSettings();

            settingsKeeper.setServiceSettings(settings);

            log.debug("Service settings was updated: {}", settingsKeeper.getServiceSettings());
        } catch (Exception e) {
            String msg = "Failed to update service settings. Reason: {}";

            log.error(msg, e);
        }
    }
}
