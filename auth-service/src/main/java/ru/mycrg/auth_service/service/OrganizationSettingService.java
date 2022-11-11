package ru.mycrg.auth_service.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.vladmihalcea.hibernate.type.json.internal.JacksonUtil;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.auth_service.entity.Organization;
import ru.mycrg.auth_service.exceptions.AuthServiceException;
import ru.mycrg.auth_service.exceptions.BadRequestException;
import ru.mycrg.auth_service.exceptions.NotFoundException;
import ru.mycrg.auth_service.repository.OrganizationRepository;
import ru.mycrg.auth_service_contract.dto.OrgSettingsRequestDto;
import ru.mycrg.auth_service_contract.dto.OrgSettingsResponseDto;
import ru.mycrg.auth_service_contract.events.request.OrgSettingsUpdatedEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.*;
import java.util.stream.Collectors;

import static com.vladmihalcea.hibernate.type.json.internal.JacksonUtil.fromString;
import static com.vladmihalcea.hibernate.type.json.internal.JacksonUtil.toJsonNode;
import static ru.mycrg.auth_service.AuthJWTApplication.mapper;
import static ru.mycrg.auth_service.util.SettingsHandler.mergeSettings;

@Service
@Transactional
public class OrganizationSettingService {

    public static final long ROOT_ORG_ID = -1L;

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

    public Set<OrgSettingsResponseDto> getSystemSettings() {
        Organization systemOrganization = organizationRepository.findById(ROOT_ORG_ID)
                                                                .orElseThrow(() -> new NotFoundException(ROOT_ORG_ID));

        Set<OrgSettingsRequestDto> systemSettings = readSystemSettings(systemOrganization.getSettings());

        Set<OrgSettingsResponseDto> result = new HashSet<>();
        List<Long> ids = systemSettings.stream()
                                       .map(OrgSettingsRequestDto::getId)
                                       .collect(Collectors.toList());

        Iterable<Organization> allExistOrg = organizationRepository.findAllById(ids);
        allExistOrg.forEach(o -> {
            systemSettings.stream().filter(org -> org.getId().equals(o.getId()))
                          .findFirst()
                          .ifPresent(orgS -> {
                              result.add(new OrgSettingsResponseDto(o.getId(), o.getName(), orgS.getSettings()));
                          });
        });

        return result;
    }

    public OrgSettingsResponseDto getSettings(Long id) {
        Map<String, Object> systemSettings = new HashMap<>();
        Optional<OrgSettingsResponseDto> oSystem = getSystemSettings().stream()
                                                                      .filter(dto -> dto.getId().equals(id))
                                                                      .findFirst();
        if (oSystem.isPresent()) {
            systemSettings = oSystem.get().getSystem();
        }

        return new OrgSettingsResponseDto(id, systemSettings, getOrgSettings(id));
    }

    /**
     * Обновление настроек.
     * <p>
     * Метод, на данный момент, используется только из защищенного контроллера, поэтому не требует секьюрити проверок.
     *
     * @param id          Идентификатор организации
     * @param newSettings Новые настройки
     */
    public void updateSettings(Long id, OrgSettingsRequestDto newSettings) {
        if (authenticationFacade.isRoot()) {
            Organization systemOrganization = organizationRepository.findById(id)
                                                                    .orElseThrow(() -> new NotFoundException(id));

            Map<String, Object> resultSettings;

            log.debug("Add new setting: '{}' to system settings", newSettings);

            Set<OrgSettingsRequestDto> systemSettings = readSystemSettings(systemOrganization.getSettings());

            Optional<OrgSettingsRequestDto> oOrgSettings = readSystemSettingsForOrganization(newSettings.getId());
            if (oOrgSettings.isPresent()) {
                OrgSettingsRequestDto oldSettings = oOrgSettings.get();

                resultSettings = overlapOldSettings(oldSettings.getSettings(), newSettings.getSettings());

                oldSettings.setSettings(resultSettings);

                replaceSetting(systemSettings, oldSettings);
            } else {
                systemSettings.add(newSettings);
            }

            systemOrganization.setSettings(
                    toJsonNode(JacksonUtil.toString(systemSettings)));

            organizationRepository.save(systemOrganization);

            mergeAndBroadcast(newSettings.getSettings(),
                              getOrgSettings(newSettings.getId()),
                              systemOrganization.getId());
        } else {
            if (!Objects.equals(id, newSettings.getId())) {
                // BadRequestException а не ForbiddenException осмысленно, чтобы не было возможности вычислить
                // существующие организации.
                throw new BadRequestException("Сущность не найден(а) по идентификатору: " + newSettings.getId());
            }

            Long orgId = newSettings.getId();
            Map<String, Object> newOrgSettings = newSettings.getSettings();

            Organization organization = organizationRepository.findById(orgId)
                                                              .orElseThrow(() -> new NotFoundException(orgId));

            organization.setSettings(
                    toJsonNode(JacksonUtil.toString(newOrgSettings)));

            organizationRepository.save(organization);

            Map<String, Object> systemOrgSettings = new HashMap<>();
            Optional<OrgSettingsRequestDto> oSystemOrgSettings = readSystemSettingsForOrganization(orgId);
            if (oSystemOrgSettings.isPresent()) {
                systemOrgSettings = oSystemOrgSettings.get().getSettings();
            }

            mergeAndBroadcast(systemOrgSettings, newOrgSettings, orgId);
        }
    }

    public void initOrgSetting(Organization organization) {
        Map<String, Object> enabledKnownSetting = new HashMap<>();
        getKnownSetting().forEach((k, v) -> enabledKnownSetting.put(k, true));

        // init in system settings
        Set<OrgSettingsRequestDto> systemSettings = getSystemSettings()
                .stream()
                .map(responseDto -> new OrgSettingsRequestDto(responseDto.getId(), responseDto.getSystem()))
                .collect(Collectors.toSet());

        systemSettings.add(new OrgSettingsRequestDto(organization.getId(), enabledKnownSetting));

        Organization systemOrganization = organizationRepository.findById(ROOT_ORG_ID)
                                                                .orElseThrow(() -> new NotFoundException(ROOT_ORG_ID));

        systemOrganization.setSettings(
                toJsonNode(JacksonUtil.toString(systemSettings)));

        organizationRepository.save(systemOrganization);

        // init in organization settings
        organization.setSettings(
                toJsonNode(JacksonUtil.toString(enabledKnownSetting)));

        organizationRepository.save(organization);
    }

    private void replaceSetting(Set<OrgSettingsRequestDto> systemSettings, OrgSettingsRequestDto oldSettings) {
        systemSettings.remove(new OrgSettingsRequestDto(oldSettings.getId()));
        systemSettings.add(oldSettings);
    }

    private void mergeAndBroadcast(Map<String, Object> systemOrgSettings,
                                   Map<String, Object> newOrgSettings,
                                   Long orgId) {
        Map<String, Object> mergedSettings = mergeSettings(systemOrgSettings, newOrgSettings);

        log.debug("Broadcast new settings: {}", mergedSettings);

        messageBus.produce(
                new OrgSettingsUpdatedEvent(orgId, mergedSettings));
    }

    @NotNull
    private Map<String, Object> getOrgSettings(Long orgId) {
        Map<String, Object> result = new HashMap<>();
        Organization organization = organizationRepository.findById(orgId)
                                                          .orElseThrow(() -> new NotFoundException(orgId));

        JsonNode settings = organization.getSettings();
        if (settings != null) {
            result = fromString(settings.toString(), Map.class);
        }

        return result;
    }

    /**
     * Накладываем новые настройки поверх старых. Используем известные нам настройки.
     */
    private Map<String, Object> overlapOldSettings(Map<String, Object> oldSettings,
                                                   Map<String, Object> newSettings) {
        Map<String, Object> result = new HashMap<>();
        if (oldSettings != null) {
            result = new HashMap<>(oldSettings);
        }

        for (Map.Entry<String, String> entry: knownSettings.entrySet()) {
            String k = entry.getKey();
            if (newSettings.containsKey(k)) {
                result.put(k, newSettings.get(k));
            }
        }

        return result;
    }

    private Set<OrgSettingsRequestDto> readSystemSettings(JsonNode jsonNode) {
        if (jsonNode == null) {
            return new HashSet<>();
        }

        try {
            return mapper.readValue(jsonNode.toString(),
                                    new TypeReference<Set<OrgSettingsRequestDto>>() {
                                    });
        } catch (Exception e) {
            String msg = String.format("Не удалось прочесть настройки всех организаций: '%s' из БД. Причина: %s",
                                       jsonNode, e.getMessage());
            log.error(msg, e);

            throw new AuthServiceException(msg);
        }
    }

    private Optional<OrgSettingsRequestDto> readSystemSettingsForOrganization(Long orgId) {
        Organization systemOrganization = organizationRepository.findById(ROOT_ORG_ID)
                                                                .orElseThrow(() -> new NotFoundException(ROOT_ORG_ID));

        return readSystemSettings(systemOrganization.getSettings())
                .stream()
                .filter(settings -> settings.getId().equals(orgId))
                .findFirst();
    }
}
