package ru.mycrg.auth_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.auth_service.dto.OrganizationFullProjection;
import ru.mycrg.auth_service.entity.Organization;
import ru.mycrg.auth_service.service.OrganizationService;
import ru.mycrg.auth_service_contract.dto.OrganizationCreateDto;

import javax.validation.Valid;
import java.net.URI;

import static org.springframework.http.HttpStatus.ACCEPTED;
import static org.springframework.http.HttpStatus.NO_CONTENT;
import static ru.mycrg.auth_service_contract.Authorities.GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY;

@RestController
@RequestMapping(value = "/organizations")
public class OrganizationController {

    private final Logger log = LoggerFactory.getLogger(OrganizationController.class);

    private final OrganizationService organizationService;

    @Autowired
    public OrganizationController(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    @PostMapping("/init")
    public ResponseEntity<Object> createOrganization(@Valid @RequestBody OrganizationCreateDto createDto) {
        log.debug("Request create organization: {}", createDto.getName());

        Organization newOrganization = organizationService.create(createDto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/{id}")
                .buildAndExpand(newOrganization.getId())
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(location);

        return new ResponseEntity<>(headers, ACCEPTED);
    }

    @GetMapping("/{id}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<OrganizationFullProjection> getOrganization(@PathVariable Long id) {
        OrganizationFullProjection projection = organizationService.findById(id);

        return ResponseEntity.ok(projection);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> deleteOrganization(@PathVariable Long id) {
        log.debug("Request delete organization: {}", id);

        organizationService.delete(id);

        return ResponseEntity.status(NO_CONTENT).build();
    }
}
