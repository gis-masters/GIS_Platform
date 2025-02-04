package ru.mycrg.auth_service.service.organization.settings;

import ru.mycrg.auth_service_contract.dto.OrgSettingsResponseDto;

import java.util.Map;

public interface IOrgSettingsBroadcaster {

    /**
     * Разослать настройки всех организаций.
     */
    void broadcast();

    /**
     * Разослать настройки одной организации.
     */
    void broadcast(OrgSettingsResponseDto orgSettings);

    /**
     * Разослать настройки одной организации.
     */
    void broadcast(Long orgId,
                   Map<String, Object> orgSystemSettings,
                   Map<String, Object> orgSettings);
}
