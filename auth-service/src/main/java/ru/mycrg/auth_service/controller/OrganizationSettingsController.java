package ru.mycrg.auth_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.auth_service.service.OrganizationSettingService;
import ru.mycrg.auth_service_contract.dto.OrgSettingsRequestDto;
import ru.mycrg.auth_service_contract.dto.OrgSettingsResponseDto;

import javax.validation.Valid;
import java.util.Set;

import static ru.mycrg.auth_service_contract.Authorities.SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;

/**
 * POST эндпоинта нет, настройки это одно из полей организации, которое можно обновлять через PATCH
 */
@RestController
public class OrganizationSettingsController {

    private final OrganizationSettingService organizationSettingService;
    private final IAuthenticationFacade authenticationFacade;

    public OrganizationSettingsController(OrganizationSettingService organizationSettingService,
                                          IAuthenticationFacade authenticationFacade) {
        this.organizationSettingService = organizationSettingService;
        this.authenticationFacade = authenticationFacade;
    }

    /**
     * Вернёт известные системе настройки.
     */
    @GetMapping("/organizations/known-settings")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> getKnownSettings() {
        return ResponseEntity.ok(organizationSettingService.getKnownSetting());
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

    /**
     * Обновит настройки организации указанной в токене пользователя.
     */
    @PatchMapping("/organizations/settings")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> updateSettings(@RequestBody @Valid OrgSettingsRequestDto settings) {
        Long orgId = authenticationFacade.getOrganizationId();

        organizationSettingService.updateSettings(orgId, settings);

        return ResponseEntity.noContent().build();
    }
}
