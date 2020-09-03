package ru.mycrg.auth_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.auth_service.entity.Organization;
import ru.mycrg.auth_service.service.OrganizationService;
import ru.mycrg.auth_service_contract.dto.OrganizationCreateDto;

import javax.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping(value = "/organizations")
public class OrganizationController {

    private static final Logger log = LoggerFactory.getLogger(OrganizationController.class);

    @Autowired
    private OrganizationService organizationService;

    @PostMapping("/init")
    public ResponseEntity createOrganization(@Valid @RequestBody OrganizationCreateDto createDto) {
        log.debug("Request create organization: {}", createDto.getName());

        Organization newOrganization = organizationService.createOrg(createDto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/{id}")
                .buildAndExpand(newOrganization.getId())
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(location);

        return new ResponseEntity(headers, HttpStatus.ACCEPTED);
    }

}
