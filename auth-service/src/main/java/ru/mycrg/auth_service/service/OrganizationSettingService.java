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
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.*;
import java.util.stream.Collectors;

import static com.vladmihalcea.hibernate.type.json.internal.JacksonUtil.toJsonNode;
import static ru.mycrg.auth_service.AuthJWTApplication.mapper;
import static ru.mycrg.auth_service.util.SettingsHandler.*;

@Service
@Transactional
public class OrganizationSettingService {

    private static final long ROOT_ORG_ID = -1L;

    private final Logger log = LoggerFactory.getLogger(OrganizationSettingService.class);

    private final IMessageBusProducer messageBus;
    private final IAuthenticationFacade authenticationFacade;
    private final OrganizationRepository organizationRepository;
    private final OrgSettingsSchemaHolder orgSettingsSchemaHolder;

    @Autowired
    public OrganizationSettingService(OrganizationRepository organizationRepository,
                                      IMessageBusProducer messageBus,
                                      IAuthenticationFacade authenticationFacade,
                                      OrgSettingsSchemaHolder orgSettingsSchemaHolder) {
        this.messageBus = messageBus;
        this.authenticationFacade = authenticationFacade;
        this.organizationRepository = organizationRepository;
        this.orgSettingsSchemaHolder = orgSettingsSchemaHolder;
    }

    public Set<OrgSettingsResponseDto> getSystemSettings() {
        Organization systemOrganization = organizationRepository.findById(ROOT_ORG_ID)
                                                                .orElseThrow(() -> new NotFoundException(ROOT_ORG_ID));

        Set<OrgSettingsRequestDto> systemSettings = readSystemSettings(systemOrganization.getSettings());

        List<Long> ids = systemSettings.stream()
                                       .map(OrgSettingsRequestDto::getId)
                                       .collect(Collectors.toList());

        SchemaDto schema = orgSettingsSchemaHolder.getSchema();
        Set<OrgSettingsResponseDto> result = new HashSet<>();
        organizationRepository
                .findAllById(ids)
                .forEach(organization -> {
                    systemSettings.stream()
                                  .filter(org -> org.getId().equals(organization.getId()))
                                  .findFirst()
                                  .ifPresent(systemOrg -> {
                                      Map<String, Object> orgSettings = readSettings(organization.getSettings());

                                      result.add(
                                              new OrgSettingsResponseDto(
                                                      organization.getId(),
                                                      organization.getName(),
                                                      processSettings(schema, systemOrg.getSettings()),
                                                      processSettings(schema, orgSettings)));
                                  });
                });

        return result.stream()
                     .sorted((o1, o2) -> (int) (o1.getId() - o2.getId()))
                     .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    public OrgSettingsResponseDto getSettings(Long id) {
        Map<String, Object> systemSettings = new HashMap<>();
        Optional<OrgSettingsResponseDto> oSystem = getSystemSettings().stream()
                                                                      .filter(dto -> dto.getId().equals(id))
                                                                      .findFirst();
        if (oSystem.isPresent()) {
            OrgSettingsResponseDto dto = oSystem.get();

            return new OrgSettingsResponseDto(id, dto.getName(), dto.getSystem(), getOrgSettings(id));
        }

        return new OrgSettingsResponseDto(id, systemSettings, getOrgSettings(id));
    }

    /**
     * Обновление настроек.
     * <p>
     * Метод, на данный момент, используется только из защищенного контроллера, поэтому не требует секьюрити проверок.
     *
     * @param currentOrgId   Идентификатор организации
     * @param newSettingsDto Новые настройки
     */
    public void updateSettings(Long currentOrgId, OrgSettingsRequestDto newSettingsDto) {
        SchemaDto schema = orgSettingsSchemaHolder.getSchema();
        Long orgId = newSettingsDto.getId();
        Map<String, Object> clearedSettings = excludeUnknownKeys(schema, newSettingsDto.getSettings());
        if (clearedSettings.isEmpty()) {
            throw new BadRequestException("Заданы не корректные настройки: " + newSettingsDto);
        }

        if (authenticationFacade.isRoot()) {
            Organization systemOrganization = organizationRepository
                    .findById(currentOrgId)
                    .orElseThrow(() -> new NotFoundException(currentOrgId));

            Map<String, Object> resultSettings;

            log.debug("Add new setting: '{}' to system settings", clearedSettings);

            Set<OrgSettingsRequestDto> systemSettings = readSystemSettings(systemOrganization.getSettings());

            Optional<OrgSettingsRequestDto> oOrgSettings = readSystemSettingsForOrganization(orgId);
            if (oOrgSettings.isPresent()) {
                OrgSettingsRequestDto currentSettingsDto = oOrgSettings.get();

                resultSettings = overlapOldSettings(schema, currentSettingsDto.getSettings(), clearedSettings);

                currentSettingsDto.setSettings(resultSettings);

                // Update system settings
                systemSettings.remove(new OrgSettingsRequestDto(currentSettingsDto.getId()));
                systemSettings.add(currentSettingsDto);
            } else {
                systemSettings.add(new OrgSettingsRequestDto(orgId, clearedSettings));
            }

            systemOrganization.setSettings(
                    toJsonNode(JacksonUtil.toString(systemSettings)));

            organizationRepository.save(systemOrganization);

            mergeAndBroadcast(clearedSettings,
                              getOrgSettings(orgId),
                              systemOrganization.getId());
        } else {
            if (!Objects.equals(currentOrgId, orgId)) {
                // BadRequestException а не ForbiddenException осмысленно, чтобы не было возможности вычислить
                // существующие организации.
                throw new BadRequestException("Сущность не найден(а) по идентификатору: " + orgId);
            }

            Organization organization = organizationRepository.findById(currentOrgId)
                                                              .orElseThrow(() -> new NotFoundException(currentOrgId));

            Map<String, Object> resultSettings = overlapOldSettings(schema,
                                                                    readSettings(organization.getSettings()),
                                                                    clearedSettings);
            organization.setSettings(JacksonUtil.toJsonNode(JacksonUtil.toString(resultSettings)));

            organizationRepository.save(organization);

            Map<String, Object> systemOrgSettings = new HashMap<>();
            Optional<OrgSettingsRequestDto> oSystemOrgSettings = readSystemSettingsForOrganization(currentOrgId);
            if (oSystemOrgSettings.isPresent()) {
                systemOrgSettings = oSystemOrgSettings.get().getSettings();
            }

            mergeAndBroadcast(systemOrgSettings, resultSettings, currentOrgId);
        }
    }

    synchronized
    public void initOrgSetting(Organization organization) {
        Map<String, Object> enabledKnownSetting = orgSettingsSchemaHolder.allInclusive();

        // init in system settings
        Set<OrgSettingsRequestDto> systemSettings = getSystemSettings()
                .stream()
                .map(responseDto -> new OrgSettingsRequestDto(responseDto.getId(), responseDto.getSystem()))
                .collect(Collectors.toSet());

        systemSettings.add(new OrgSettingsRequestDto(organization.getId(), enabledKnownSetting));

        Organization systemOrganization = organizationRepository.findById(ROOT_ORG_ID)
                                                                .orElseThrow(() -> new NotFoundException(ROOT_ORG_ID));

        String settingAsJson = JacksonUtil.toString(systemSettings);
        log.info("Update system settings to: '{}'", settingAsJson);
        systemOrganization.setSettings(toJsonNode(settingAsJson));

        organizationRepository.save(systemOrganization);

        // init in organization settings
        organization.setSettings(toJsonNode(JacksonUtil.toString(enabledKnownSetting)));

        organizationRepository.save(organization);
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
        SchemaDto schema = orgSettingsSchemaHolder.getSchema();
        Map<String, Object> result = new HashMap<>();
        JsonNode settings = organizationRepository.findById(orgId)
                                                  .orElseThrow(() -> new NotFoundException(orgId))
                                                  .getSettings();
        if (settings != null) {
            result = JacksonUtil.fromString(settings.toString(), Map.class);
        }

        return processSettings(schema, result);
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

    private Map<String, Object> readSettings(JsonNode jsonNode) {
        if (jsonNode == null) {
            return new HashMap<>();
        }

        try {
            return mapper.readValue(jsonNode.toString(), Map.class);
        } catch (Exception e) {
            String msg = String.format("Не удалось прочесть настройки организации: '%s'. Причина: %s",
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
