package ru.mycrg.gis_service.controller.geoserver;

import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis_service.dto.geoserver.OrgCreateDto;
import ru.mycrg.gis_service.service.OrganizationService;

import javax.validation.Valid;
import java.util.List;

import static ru.mycrg.auth_service_contract.Authorities.SYSTEM_ADMIN_AUTHORITY;
import static ru.mycrg.auth_service_contract.Authorities.SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY;

@RestController
@RequestMapping(value = "/geoserver/organizations")
public class OrganizationController {

    private final OrganizationService bpmnService;

    public OrganizationController(OrganizationService bpmnService) {
        this.bpmnService = bpmnService;
    }

    @PostMapping
    @PreAuthorize(SYSTEM_ADMIN_AUTHORITY)
    public ResponseEntity<Object> createOrganizationOnGeoserver(@Valid @RequestBody OrgCreateDto dto,
                                                                Authentication authentication) {
        final ProcessInstance processInstance = bpmnService.create(dto, authentication);

        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body(processInstance.getId());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> deleteOrganizationOnGeoserver(@PathVariable Long id,
                                                                @RequestBody List<String> users,
                                                                Authentication authentication) {
        final ProcessInstance processInstance = bpmnService.delete(id, users, authentication);

        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body(processInstance.getId());
    }
}
