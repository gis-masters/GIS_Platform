package ru.mycrg.auth_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.auth_service.service.OrganizationSettingService;

import java.util.Map;

import static ru.mycrg.auth_service_contract.Authorities.*;

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
        Long orgId = authenticationFacade.getOrganizationId();

        Map<String, Object> settings = organizationSettingService.getSetting(orgId);

        return ResponseEntity.ok(settings);
    }

    /**
     * Обновит настройки организации указанной в токене пользователя.
     * <p>
     * Только владелец организации может воспользоваться этим эндпоинтом.
     */
    @PatchMapping("/organizations/settings")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> updateSettings(@RequestBody String jsonSettings) {
        Long orgId = authenticationFacade.getOrganizationId();

        organizationSettingService.updateSettings(orgId, jsonSettings);

        return ResponseEntity.noContent().build();
    }

    /**
     * Вернёт настройки указанной организации.
     * <p>
     * Только супер админ может воспользоваться этим эндпоинтом.
     *
     * @param id Идентфикатор организации.
     */
    @GetMapping("/organizations/{id}/settings")
    @PreAuthorize(GLOBAL_ADMIN_AUTHORITY)
    public ResponseEntity<Object> getSpecificSettings(@PathVariable Long id) {
        Map<String, Object> settings = organizationSettingService.getSetting(id);

        return ResponseEntity.ok(settings);
    }

    /**
     * Обновит настройки указанной организации.
     * <p>
     * Только супер админ может воспользоваться этим эндпоинтом.
     *
     * @param id Идентфикатор организации.
     */
    @PatchMapping("/organizations/{id}/settings")
    @PreAuthorize(GLOBAL_ADMIN_AUTHORITY)
    public ResponseEntity<Object> updateSpecificSettings(@PathVariable Long id,
                                                         @RequestBody String jsonSettings) {
        organizationSettingService.updateSettings(id, jsonSettings);

        return ResponseEntity.noContent().build();
    }
}
