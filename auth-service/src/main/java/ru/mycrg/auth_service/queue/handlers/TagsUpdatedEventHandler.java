package ru.mycrg.auth_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_service.exceptions.AuthServiceException;
import ru.mycrg.auth_service.service.organization.settings.IOrgSettingsBroadcaster;
import ru.mycrg.auth_service.service.organization.settings.OrgSettingsSchemaHolder;
import ru.mycrg.auth_service_contract.events.response.SystemTagsUpdatedEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

@Component
public class TagsUpdatedEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(TagsUpdatedEventHandler.class);

    private final IOrgSettingsBroadcaster settingsBroadcaster;
    private final OrgSettingsSchemaHolder orgSettingsSchemaHolder;

    public TagsUpdatedEventHandler(IOrgSettingsBroadcaster settingsBroadcaster,
                                   OrgSettingsSchemaHolder orgSettingsSchemaHolder) {
        this.settingsBroadcaster = settingsBroadcaster;
        this.orgSettingsSchemaHolder = orgSettingsSchemaHolder;
    }

    @Override
    public String getEventType() {
        return SystemTagsUpdatedEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        try {
            SystemTagsUpdatedEvent event = (SystemTagsUpdatedEvent) mqEvent;

            log.info("Получили новые системные теги: {}", event.getTags());

            orgSettingsSchemaHolder.updateTags(event.getTags());
            settingsBroadcaster.broadcast();
        } catch (Exception e) {
            String msg = "Не удалось обновить теги настроек организаций. По причине: " + e.getMessage();
            log.error(msg, e);

            throw new AuthServiceException(msg, e.getCause());
        }
    }
}
