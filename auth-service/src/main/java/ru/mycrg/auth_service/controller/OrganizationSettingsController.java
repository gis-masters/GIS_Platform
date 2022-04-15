package ru.mycrg.auth_service.controller;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.auth_service.security.IAuthenticationFacade;
import ru.mycrg.auth_service.service.OrganizationService;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.auth_service_contract.Authorities.ORG_ADMIN_AUTHORITY;

@RestController
@RequestMapping(value = "/organizations/settings")
public class OrganizationSettingsController {

    private final OrganizationService organizationService;
    private final IAuthenticationFacade authenticationFacade;

    public OrganizationSettingsController(OrganizationService organizationService,
                                          IAuthenticationFacade authenticationFacade) {
        this.organizationService = organizationService;
        this.authenticationFacade = authenticationFacade;
    }

    @GetMapping
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<JsonNode> getSettings() {
        Long orgId = authenticationFacade.getOrganizationId();

        JsonNode settings = organizationService.getSetting(orgId);

        return ResponseEntity.ok(settings);
    }

    @PutMapping
    @PreAuthorize(ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> updateSettings(@RequestBody String jsonSettings) {
        Long orgId = authenticationFacade.getOrganizationId();

        organizationService.updateSettings(orgId, jsonSettings);

        return ResponseEntity.noContent().build();
    }
}
