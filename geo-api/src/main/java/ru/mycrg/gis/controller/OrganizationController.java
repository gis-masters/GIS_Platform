package ru.mycrg.gis.controller;

import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.common.OrgMqProcessRequest;
import ru.mycrg.common.enums.RequestType;
import ru.mycrg.gis.dto.OrganizationCreateDto;
import ru.mycrg.gis.dto.OrganizationUpdateDto;
import ru.mycrg.gis.entity.Organization;
import ru.mycrg.gis.entity.User;
import ru.mycrg.gis.exceptions.EntityCreationException;
import ru.mycrg.gis.exceptions.OrganizationCreateException;
import ru.mycrg.gis.queue.IMqEvents;
import ru.mycrg.gis.repository.UserRepository;
import ru.mycrg.gis.service.OrganizationService;

import javax.validation.Valid;
import java.net.URI;
import java.security.Principal;
import java.util.Optional;
import java.util.UUID;

import static ru.mycrg.gis.util.PageAndSortUtil.getPageableRequest;

@RestController
@RequestMapping(value = "/organizations")
public class OrganizationController {

    private static final Logger log = LoggerFactory.getLogger(OrganizationController.class);

    private final IMqEvents mqEvents;
    private final UserRepository userRepository;
    private final OrganizationService organizationService;

    @Autowired
    public OrganizationController(OrganizationService organizationService, IMqEvents mqEvents,
                                  UserRepository userRepository) {
        this.mqEvents = mqEvents;
        this.userRepository = userRepository;
        this.organizationService = organizationService;
    }

    @GetMapping("/info")
    public ResponseEntity<Long> getMyOrganizationInfo(Principal principal) {
        log.debug("get org info(...only id yet) for user: {}", principal.getName());

        return ResponseEntity.ok(organizationService.getOrganizationByUser(principal.getName()).getId());
    }

    // TODO: Добавить авторизацию, закрыть доступ неавторизированным пользователям
    @GetMapping
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

        Optional<User> userByEmail = userRepository.findUserByEmail(createDto.getEmail());
        if (userByEmail.isPresent()) {
            throw new EntityCreationException("Данный email уже занят");
        }

        Organization newOrganization;
        try {
            newOrganization = organizationService.create(createDto);
        } catch (Exception e) {
            log.error("Неудалось создать организацию: ", e);

            throw new OrganizationCreateException();
        }

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(newOrganization.getId())
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(location);

        mqEvents.sendOrgEvent(new OrgMqProcessRequest(UUID.randomUUID(), newOrganization.getId(),
                createDto.getEmail(),
                createDto.getPassword(),
                RequestType.CREATE_ORG));

        return new ResponseEntity(headers, HttpStatus.ACCEPTED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Organization> getById(@PathVariable long id) {
        log.debug("Get organization by id: {}", id);

        return ResponseEntity.ok(organizationService.findById(id));
    }

    @DeleteMapping("/{id}")
    public HttpStatus deleteOrganization(@PathVariable long id) {
        log.debug("Delete organization by id: {}", id);

        organizationService.deleteById(id);

        return HttpStatus.NO_CONTENT;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Organization> updateOrganization(@Valid @RequestBody OrganizationUpdateDto organizationDto,
                                                           @PathVariable long id) {
        log.debug("Update organization");

        organizationService.update(id, organizationDto);

        return ResponseEntity.noContent().build();
    }

}
