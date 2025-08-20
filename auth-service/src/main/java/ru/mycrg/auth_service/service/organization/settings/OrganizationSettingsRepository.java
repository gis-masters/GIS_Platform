package ru.mycrg.auth_service.service.organization.settings;

import com.fasterxml.jackson.databind.JsonNode;
import com.vladmihalcea.hibernate.type.json.internal.JacksonUtil;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_service.entity.Organization;
import ru.mycrg.auth_service.exceptions.NotFoundException;
import ru.mycrg.auth_service.repository.OrganizationRepository;
import ru.mycrg.auth_service_contract.dto.OrgSettingsRequestDto;
import ru.mycrg.auth_service_contract.dto.OrgSettingsResponseDto;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.*;
import java.util.stream.Collectors;

import static ru.mycrg.auth_service.service.organization.settings.OrganizationSettingService.ROOT_ORG_ID;
import static ru.mycrg.auth_service.service.organization.settings.SettingsMapper.mapToSettings;
import static ru.mycrg.auth_service.service.organization.settings.SettingsMapper.mapToSystemSettings;
import static ru.mycrg.auth_service.service.organization.settings.SettingsUtil.processSettings;

@Component
public class OrganizationSettingsRepository {

    private final OrganizationRepository organizationRepository;
    private final OrgSettingsSchemaHolder orgSettingsSchemaHolder;

    public OrganizationSettingsRepository(OrganizationRepository organizationRepository,
                                          OrgSettingsSchemaHolder orgSettingsSchemaHolder) {
        this.organizationRepository = organizationRepository;
        this.orgSettingsSchemaHolder = orgSettingsSchemaHolder;
    }

    public Set<OrgSettingsRequestDto> readSystemSettings() {
        Organization systemOrganization = organizationRepository.findById(ROOT_ORG_ID)
                                                                .orElseThrow(() -> new NotFoundException(ROOT_ORG_ID));

        return mapToSystemSettings(systemOrganization.getSettings());
    }

    public Set<OrgSettingsResponseDto> readSystemSettings2() {
        Organization systemOrganization = organizationRepository.findById(ROOT_ORG_ID)
                                                                .orElseThrow(() -> new NotFoundException(ROOT_ORG_ID));

        Set<OrgSettingsRequestDto> systemSettings = mapToSystemSettings(systemOrganization.getSettings());

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
                                      Map<String, Object> orgSettings = mapToSettings(organization.getSettings());

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

    public OrgSettingsResponseDto readOrganizationSettings(Long id) {
        Map<String, Object> systemSettings = new HashMap<>();
        Optional<OrgSettingsResponseDto> oSystem = readSystemSettings2().stream()
                                                                        .filter(dto -> dto.getId().equals(id))
                                                                        .findFirst();
        if (oSystem.isPresent()) {
            OrgSettingsResponseDto dto = oSystem.get();

            return new OrgSettingsResponseDto(id, dto.getName(), dto.getSystem(), getOrgSettings(id));
        }

        return new OrgSettingsResponseDto(id, systemSettings, getOrgSettings(id));
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
}
