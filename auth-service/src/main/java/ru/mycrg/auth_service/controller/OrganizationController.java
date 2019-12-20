package ru.mycrg.auth_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.auth_service.dto.OrganizationCreateDto;
import ru.mycrg.auth_service.entity.Organization;
import ru.mycrg.auth_service.service.OrganizationService;

import javax.validation.Valid;
import java.net.URI;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

@RestController
@RequestMapping(value = "/organizations")
public class OrganizationController {

    private static final Logger log = LoggerFactory.getLogger(OrganizationController.class);

    @Autowired
    private OrganizationService organizationService;

    @Autowired
    private PagedResourcesAssembler<Organization> assembler;

    @Autowired
    private EntityLinks links;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getOrganizations(Pageable pageable) {
        Page<Organization> organizations = organizationService.findAll(pageable);

        Link pageSelfLink = links.linkFor(Organization.class).withSelfRel();
        PagedResources<?> pagedResources = assembler.toResource(organizations, this::toResource, pageSelfLink);

        return ResponseEntity.ok(pagedResources);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Resource<Organization> getOrganizationById(@PathVariable Long id) {

        Organization organization = organizationService.findById(id);

        Resource<Organization> resource = new Resource<>(organization);
        resource.add(linkTo(OrganizationController.class).slash(organization.getId()).withSelfRel());
        resource.add(linkTo(OrganizationController.class).slash(organization.getId()).withRel("organization"));

        return resource;
    }

    @PostMapping
    public ResponseEntity createOrganization(@Valid @RequestBody OrganizationCreateDto createDto) {
        log.debug("Request create organization: {}", createDto.getName());

        Organization newOrganization = organizationService.createOrg(createDto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(newOrganization.getId())
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(location);

        return new ResponseEntity(headers, HttpStatus.ACCEPTED);
    }

    private ResourceSupport toResource(Organization organization) {
        Link organizationLink = links.linkForSingleResource(organization).withRel("organization");
        Link selfLink = links.linkForSingleResource(organization).withSelfRel();

        return new Resource<>(organization, organizationLink, selfLink);
    }

}
