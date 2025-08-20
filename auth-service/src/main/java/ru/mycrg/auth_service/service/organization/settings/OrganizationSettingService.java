package ru.mycrg.auth_service.service.organization.settings;

import com.vladmihalcea.hibernate.type.json.internal.JacksonUtil;
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
import ru.mycrg.common_contracts.generated.specialization.SpecializationView;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.*;
import java.util.stream.Collectors;

import static com.vladmihalcea.hibernate.type.json.internal.JacksonUtil.toJsonNode;
import static ru.mycrg.auth_service.service.organization.settings.SettingsMapper.mapToSettings;
import static ru.mycrg.auth_service.service.organization.settings.SpecializationSettingsHandler.fillSettingsBySpecialization;
import static ru.mycrg.auth_service.service.organization.settings.SettingsUtil.*;

@Service
@Transactional
public class OrganizationSettingService {

    public static final long ROOT_ORG_ID = -1L;

    private final Logger log = LoggerFactory.getLogger(OrganizationSettingService.class);

    private final IAuthenticationFacade authenticationFacade;
    private final IOrgSettingsBroadcaster settingsBroadcaster;
    private final OrganizationRepository organizationRepository;
    private final OrgSettingsSchemaHolder orgSettingsSchemaHolder;
    private final OrganizationSettingsRepository orgSettingsRepository;

    @Autowired
    public OrganizationSettingService(OrganizationRepository organizationRepository,
                                      IAuthenticationFacade authenticationFacade,
                                      IOrgSettingsBroadcaster settingsBroadcaster,
                                      OrganizationSettingsRepository orgSettingsRepository,
                                      OrgSettingsSchemaHolder orgSettingsSchemaHolder) {
        this.authenticationFacade = authenticationFacade;
        this.organizationRepository = organizationRepository;
        this.settingsBroadcaster = settingsBroadcaster;
        this.orgSettingsSchemaHolder = orgSettingsSchemaHolder;
        this.orgSettingsRepository = orgSettingsRepository;
    }

    public Set<OrgSettingsResponseDto> getSystemSettings() {
        return orgSettingsRepository.readSystemSettings2();
    }

    public OrgSettingsResponseDto getSettings(Long id) {
        return orgSettingsRepository.readOrganizationSettings(id);
    }

    /**
     * Обновление настроек.
     * <p>
     * Метод, на данный момент, используется только из защищенного контроллера, поэтому не требует секьюрити проверок.
     *
     * @param incomingSettingsDto Новые настройки
     */
    public void updateSettings(OrgSettingsRequestDto incomingSettingsDto) {
        Long targetOrgId = incomingSettingsDto.getId();
        SchemaDto schema = orgSettingsSchemaHolder.getSchema();
        Map<String, Object> newClearedSettings = excludeUnknownKeys(schema, incomingSettingsDto.getSettings());
        if (newClearedSettings.isEmpty()) {
            throw new BadRequestException("Заданы не корректные настройки: " + incomingSettingsDto);
        }

        if (authenticationFacade.isRoot()) {
            Organization systemOrganization = organizationRepository
                    .findById(ROOT_ORG_ID)
                    .orElseThrow(() -> new AuthServiceException("Shit happens."));

            log.debug("Add new setting: '{}' to system settings", newClearedSettings);

            Set<OrgSettingsRequestDto> systemSettings = orgSettingsRepository.readSystemSettings();
            Optional<OrgSettingsRequestDto> oOrgSettings = systemSettings
                    .stream()
                    .filter(settings -> settings.getId().equals(targetOrgId))
                    .findFirst();
            Map<String, Object> resultSettings;
            if (oOrgSettings.isPresent()) {
                OrgSettingsRequestDto currentSettingsDto = oOrgSettings.get();

                resultSettings = overlapOldSettings(schema, currentSettingsDto.getSettings(), newClearedSettings);

                currentSettingsDto.setSettings(resultSettings);

                // Update system settings
                systemSettings.remove(new OrgSettingsRequestDto(currentSettingsDto.getId()));
                systemSettings.add(currentSettingsDto);
            } else {
                systemSettings.add(new OrgSettingsRequestDto(targetOrgId, newClearedSettings));
            }

            systemOrganization.setSettings(
                    toJsonNode(JacksonUtil.toString(systemSettings)));

            organizationRepository.save(systemOrganization);

            settingsBroadcaster.broadcast(targetOrgId,
                                          newClearedSettings,
                                          orgSettingsRepository.readOrganizationSettings(targetOrgId)
                                                               .getOrganization());
        } else {
            Long currentOrgId = authenticationFacade.getOrganizationId();
            if (!Objects.equals(currentOrgId, targetOrgId)) {
                // BadRequestException а не ForbiddenException осмысленно, чтобы не было возможности вычислить
                // существующие организации.
                throw new BadRequestException("Сущность не найден(а) по идентификатору: " + targetOrgId);
            }

            Organization organization = organizationRepository.findById(currentOrgId)
                                                              .orElseThrow(() -> new NotFoundException(currentOrgId));

            Map<String, Object> resultOrgSettings = overlapOldSettings(schema,
                                                                       mapToSettings(organization.getSettings()),
                                                                       newClearedSettings);
            organization.setSettings(JacksonUtil.toJsonNode(JacksonUtil.toString(resultOrgSettings)));

            organizationRepository.save(organization);

            Map<String, Object> systemOrgSettings = new HashMap<>();
            Set<OrgSettingsRequestDto> systemSettings = orgSettingsRepository.readSystemSettings();
            Optional<OrgSettingsRequestDto> oSystemOrgSettings = systemSettings
                    .stream()
                    .filter(settings -> settings.getId().equals(currentOrgId))
                    .findFirst();
            if (oSystemOrgSettings.isPresent()) {
                systemOrgSettings = oSystemOrgSettings.get().getSettings();
            }

            settingsBroadcaster.broadcast(currentOrgId,
                                          systemOrgSettings,
                                          resultOrgSettings);
        }
    }

    synchronized
    public void initOrgSetting(Organization organization, SpecializationView specialization) {
        Map<String, Object> orgSettings = fillSettingsBySpecialization(specialization.getSettings(),
                                                                       orgSettingsSchemaHolder.allInclusive());

        // init in system settings
        Set<OrgSettingsRequestDto> systemSettings = getSystemSettings()
                .stream()
                .map(responseDto -> new OrgSettingsRequestDto(responseDto.getId(), responseDto.getSystem()))
                .collect(Collectors.toSet());

        systemSettings.add(new OrgSettingsRequestDto(organization.getId(), orgSettings));

        Organization systemOrganization = organizationRepository.findById(ROOT_ORG_ID)
                                                                .orElseThrow(() -> new NotFoundException(ROOT_ORG_ID));

        String settingAsJson = JacksonUtil.toString(systemSettings);
        log.info("Update system settings to: '{}'", settingAsJson);
        systemOrganization.setSettings(toJsonNode(settingAsJson));

        organizationRepository.save(systemOrganization);

        // init in organization settings
        organization.setSettings(toJsonNode(JacksonUtil.toString(orgSettings)));

        organizationRepository.save(organization);
    }

    public SchemaDto getSchema() {
        if (authenticationFacade.isRoot()) {
            return orgSettingsSchemaHolder.getSchema();
        }

        return buildSchema(orgSettingsSchemaHolder.getSchema(),
                           orgSettingsRepository.readOrganizationSettings(authenticationFacade.getOrganizationId()));
    }
}
