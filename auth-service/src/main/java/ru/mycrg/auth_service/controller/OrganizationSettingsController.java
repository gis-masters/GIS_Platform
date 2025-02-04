package ru.mycrg.auth_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.auth_service.service.organization.settings.OrganizationSettingService;
import ru.mycrg.auth_service_contract.dto.OrgSettingsRequestDto;
import ru.mycrg.auth_service_contract.dto.OrgSettingsResponseDto;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import javax.validation.Valid;
import java.util.Set;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.auth_service_contract.Authorities.SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY;

/**
 * POST эндпоинта нет, настройки это одно из полей организации, которое можно обновлять через PATCH
 */
@RestController
public class OrganizationSettingsController {

    private final IAuthenticationFacade authenticationFacade;
    private final OrganizationSettingService organizationSettingService;

    public OrganizationSettingsController(OrganizationSettingService organizationSettingService,
                                          IAuthenticationFacade authenticationFacade) {
        this.authenticationFacade = authenticationFacade;
        this.organizationSettingService = organizationSettingService;
    }

    /**
     * Вернёт настройки организации указанной в токене пользователя.
     */
    @GetMapping("/organizations/settings")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> getSettings() {
        if (authenticationFacade.isRoot()) {
            Set<OrgSettingsResponseDto> systemSettings = organizationSettingService.getSystemSettings();

            return ResponseEntity.ok(systemSettings);
        } else {
            Long orgId = authenticationFacade.getOrganizationId();

            OrgSettingsResponseDto settings = organizationSettingService.getSettings(orgId);

            return ResponseEntity.ok(settings);
        }
    }

    @GetMapping("/organizations/settings/schema")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<SchemaDto> getSettingsSchema() {
        SchemaDto schema = organizationSettingService.getSchema();

        return ResponseEntity.ok(schema);
    }

    /**
     * Обновит настройки организации указанной в токене пользователя.
     */
    @PatchMapping("/organizations/settings")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> updateSettings(@RequestBody @Valid OrgSettingsRequestDto settings) {
        organizationSettingService.updateSettings(settings);

        return ResponseEntity.noContent().build();
    }
}
