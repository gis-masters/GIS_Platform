package ru.mycrg.auth_service.service.organization.settings;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service.exceptions.NotFoundException;
import ru.mycrg.auth_service_contract.dto.OrgSettingsRequestDto;
import ru.mycrg.auth_service_contract.dto.OrgSettingsResponseDto;
import ru.mycrg.auth_service_contract.events.request.OrgSettingsUpdatedEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.Map;
import java.util.Set;

import static ru.mycrg.auth_service.service.organization.settings.SettingsUtil.mergeSettings;

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
        Set<OrgSettingsRequestDto> systemSettings = orgSettingsRepository.readSystemSettings();

        if (systemSettings == null) {
            log.debug("Системные настройки пусты!!! Делать ничего не будем!!!");

            return;
        }

        for (OrgSettingsRequestDto systemOrgSetting: systemSettings) {
            try {
                OrgSettingsResponseDto orgSetting = orgSettingsRepository
                        .readOrganizationSettings(systemOrgSetting.getId());

                broadcast(orgSetting);
            } catch (NotFoundException e) {
                log.warn("Не удалось прочесть/отправить настройки организации: {} => {}",
                         systemOrgSetting.getId(),
                         e.getMessage());
            }
        }
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
