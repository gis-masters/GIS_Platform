package ru.mycrg.gis.controller;

import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.gis.dto.OrganizationCreateDto;
import ru.mycrg.gis.dto.OrganizationUpdateDto;
import ru.mycrg.gis.entity.Organization;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.service.OrganizationService;

import javax.validation.Valid;
import java.net.URI;
import java.security.Principal;

import static ru.mycrg.gis.util.PageAndSortUtil.getPageableRequest;

@RestController
@RequestMapping(value = "/organizations")
public class OrganizationController {

    private static final Logger log = LoggerFactory.getLogger(OrganizationController.class);

    private final OrganizationService organizationService;

    @Autowired
    public OrganizationController(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    // TODO: Добавить авторизацию, закрыть доступ неавторизированным пользователям
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Iterable<Organization>> getOrganizations(
            @ApiParam(defaultValue = "asc", value = "Сортировка по id организации")
            @RequestParam(value = "sort", required = false) String sort,
            @RequestParam(value = "page", required = false) String page,
            @RequestParam(value = "size", required = false) String size) {
        log.debug("Get organizations request with params: page:{} / size:{} / sort: {}", page, size, sort);

        Iterable<Organization> organizations = organizationService.findAll(getPageableRequest(page, size, sort));

        return ResponseEntity.ok(organizations);
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

    @GetMapping("/{id}")
    @PreAuthorize("hasPermission(#id, '')")
    public ResponseEntity<Organization> getById(@PathVariable long id) {
        log.debug("Get organization by id: {}", id);

        return ResponseEntity.ok(organizationService.findById(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasPermission(#id, '')")
    public HttpStatus deleteOrganization(@PathVariable long id) {
        log.debug("Delete organization by id: {}", id);

        organizationService.deleteById(id);

        return HttpStatus.NO_CONTENT;
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasPermission(#id, '')")
    public ResponseEntity<Organization> updateOrganization(@Valid @RequestBody OrganizationUpdateDto organizationDto,
                                                           @PathVariable long id) {
        log.debug("Update organization");

        organizationService.update(id, organizationDto);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/tasks/{taskId}")
    @PreAuthorize("hasPermission(#id, '')")
    public ResponseEntity<Process> getOrganizationTasks(@PathVariable long id, @PathVariable long taskId,
                                                        Principal principal) {
        log.debug("Get organization task: {}", taskId);

        return ResponseEntity.ok(organizationService.getProcessById(taskId));
    }

}
