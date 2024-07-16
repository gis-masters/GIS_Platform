package ru.mycrg.auth_service.service.organization.settings;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.dto.OrgSettingsResponseDto;
import ru.mycrg.auth_service_contract.events.request.OrgSettingsUpdatedEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.Map;

import static ru.mycrg.auth_service.util.SettingsHandler.mergeSettings;

@Service
public class OrganizationSettingsBroadcaster implements IOrgSettingsBroadcaster {

    private final Logger log = LoggerFactory.getLogger(OrganizationSettingsBroadcaster.class);

    private final IMessageBusProducer messageBus;
    private final OrganizationSettingsRepository orgSettingsRepository;

    public OrganizationSettingsBroadcaster(IMessageBusProducer messageBus,
                                           OrganizationSettingsRepository orgSettingsRepository) {
        this.messageBus = messageBus;
        this.orgSettingsRepository = orgSettingsRepository;
    }

    @Override
    public void broadcast() {
        orgSettingsRepository
                .readSystemSettings().stream()
                .map(systemOrgSetting -> orgSettingsRepository.readOrganizationSettings(systemOrgSetting.getId()))
                .forEach(this::broadcast);
    }

    @Override
    public void broadcast(OrgSettingsResponseDto orgSettings) {
        broadcast(orgSettings.getId(), orgSettings.getSystem(), orgSettings.getOrganization());
    }

    @Override
    public void broadcast(Long orgId,
                          Map<String, Object> orgSystemSettings,
                          Map<String, Object> orgSettings) {
        Map<String, Object> mergedSettings = mergeSettings(orgSystemSettings, orgSettings);

        log.debug("For organization: {}. Broadcast new settings: {}", orgId, mergedSettings);

        messageBus.produce(
                new OrgSettingsUpdatedEvent(orgId, mergedSettings));
    }
}
