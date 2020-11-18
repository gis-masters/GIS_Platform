package ru.mycrg.gis_service.controller.geoserver;

import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis_service.dto.geoserver.OrgCreateDto;
import ru.mycrg.gis_service.service.OrganizationService;

import javax.validation.Valid;
import java.util.List;

import static ru.mycrg.auth_service_contract.Authorities.GLOBAL_ADMIN_AUTHORITY;
import static ru.mycrg.auth_service_contract.Authorities.GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY;

@RestController
@RequestMapping(value = "/geoserver/organizations")
public class OrganizationController {

    private static final Logger log = LoggerFactory.getLogger(OrganizationController.class);

    private final OrganizationService organizationService;

    public OrganizationController(
            OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    @PostMapping
    @PreAuthorize(GLOBAL_ADMIN_AUTHORITY)
    public ResponseEntity<Object> createOrganizationOnGeoserver(@Valid @RequestBody OrgCreateDto dto,
                                                                Authentication authentication) {
        final ProcessInstance processInstance = organizationService.create(dto, authentication);

        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body(processInstance.getId());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> deleteOrganizationOnGeoserver(@PathVariable Long id,
                                                                @RequestBody List<String> users,
                                                                Authentication authentication) {
        log.debug("deleteOrganizationOnGeoserver: {}", users);

        organizationService.delete(id, users, authentication);

        return ResponseEntity.accepted().build();
    }
}
