package ru.mycrg.auth_service.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.auth_service.entity.Organization;
import ru.mycrg.auth_service.exceptions.AuthServiceException;
import ru.mycrg.auth_service.exceptions.BadRequestException;
import ru.mycrg.auth_service.exceptions.ForbiddenException;
import ru.mycrg.auth_service.exceptions.NotFoundException;
import ru.mycrg.auth_service.repository.OrganizationRepository;
import ru.mycrg.auth_service_contract.events.request.OrgSettingsUpdatedEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static com.vladmihalcea.hibernate.type.json.internal.JacksonUtil.fromString;
import static com.vladmihalcea.hibernate.type.json.internal.JacksonUtil.toJsonNode;
import static ru.mycrg.auth_service.AuthJWTApplication.mapper;
import static ru.mycrg.auth_service.util.SettingsHandler.mergeSettings;

@Service
@Transactional
public class OrganizationSettingService {

    private static final long GLOBAL_ORG_ID = -1L;

    private final Logger log = LoggerFactory.getLogger(OrganizationSettingService.class);

    private final IMessageBusProducer messageBus;
    private final Map<String, String> knownSettings;
    private final IAuthenticationFacade authenticationFacade;
    private final OrganizationRepository organizationRepository;

    @Autowired
    public OrganizationSettingService(OrganizationRepository organizationRepository,
                                      IMessageBusProducer messageBus,
                                      IAuthenticationFacade authenticationFacade,
                                      Map<String, String> knownSettings) {
        this.organizationRepository = organizationRepository;
        this.authenticationFacade = authenticationFacade;
        this.messageBus = messageBus;
        this.knownSettings = knownSettings;
    }

    public Map<String, String> getKnownSetting() {
        return knownSettings;
    }

    public Map<String, Object> getSetting(Long id) {
        if (authenticationFacade.isRoot() || id.equals(authenticationFacade.getOrganizationId())) {
            JsonNode settings = organizationRepository.findById(id)
                                                      .orElseThrow(() -> new NotFoundException(id))
                                                      .getSettings();

            Map<String, Object> result = new HashMap<>();
            if (settings != null) {
                Map<String, Object> current = fromString(settings.toString(), Map.class);
                knownSettings.forEach((k, v) -> {
                    if (current.containsKey(k)) {
                        result.put(k, current.get(k));
                    }
                });
            }

            return result;
        }

        throw new ForbiddenException("Нет доступа к настройкам организации: " + id);
    }

    /**
     * Обновление настроек.
     * <p>
     * Метод, на данный момент, используется только из защищенного контроллера, поэтому не требует секьюрити проверок.
     *
     * @param id          Идентификатор организации
     * @param newSettings Новые настройки
     */
    public void updateSettings(Long id, String newSettings) {
        Organization organization = organizationRepository.findById(id)
                                                          .orElseThrow(() -> new NotFoundException(id));

        Map<String, Object> overlappedSettings = overlapOldSettings(newSettings, organization.getSettings());

        organization.setSettings(
                toJsonNode(convertToJson(overlappedSettings))
        );

        organizationRepository.save(organization);

        Map<String, Object> globalSettings = getGlobalSettings();
        Map<String, Object> mergedSettings = mergeSettings(globalSettings, overlappedSettings);
        log.debug("Broadcast new settings: {}", mergedSettings);

        messageBus.produce(
                new OrgSettingsUpdatedEvent(organization.getId(), mergedSettings));
    }

    /**
     * Накладываем новые настройки поверх старых. Используем известные нам настройки.
     */
    private Map<String, Object> overlapOldSettings(String newOrgSettings, JsonNode currentOrgSettings) {
        Map<String, Object> result = new HashMap<>();
        try {
            if (currentOrgSettings != null) {
                result = fromString(currentOrgSettings.toString(), Map.class);
            }

            Map<String, Object> newSettings = fromString(newOrgSettings, Map.class);
            for (Map.Entry<String, String> entry: knownSettings.entrySet()) {
                String k = entry.getKey();
                if (newSettings.containsKey(k)) {
                    result.put(k, newSettings.get(k));
                }
            }
        } catch (Exception e) {
            String msg = "Передано некорректное тело: " + newOrgSettings;
            log.error(msg, e);

            throw new BadRequestException(msg);
        }

        return result;
    }

    private String convertToJson(Map<String, Object> oldSettings) {
        String asJsonString;
        try {
            asJsonString = mapper.writeValueAsString(oldSettings);
        } catch (Exception e) {
            String msg = "Не удалось прочитать старые настройки.";
            log.error(msg, e);

            throw new AuthServiceException(msg);
        }

        return asJsonString;
    }

    private Map<String, Object> getGlobalSettings() {
        Map<String, Object> result = new HashMap<>();

        Optional<Organization> oRootOrg = organizationRepository.findById(GLOBAL_ORG_ID);
        if (oRootOrg.isPresent()) {
            JsonNode settings = oRootOrg.get().getSettings();
            if (settings != null) {
                result = fromString(settings.toString(), Map.class);
            }
        }

        return result;
    }
}
