package ru.mycrg.auth_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.auth_service.dto.OrganizationFullProjection;
import ru.mycrg.auth_service.entity.Organization;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.service.AuthService;
import ru.mycrg.auth_service.service.organization.OrganizationService;
import ru.mycrg.auth_service_contract.AESCryptor;
import ru.mycrg.auth_service_contract.dto.OrganizationCreateDto;
import ru.mycrg.auth_service_contract.dto.OrganizationUpdateDto;
import ru.mycrg.auth_service_contract.events.request.OrganizationInitializedEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import javax.validation.Valid;
import java.net.URI;

import static org.springframework.http.HttpStatus.NO_CONTENT;
import static ru.mycrg.auth_service_contract.Authorities.SYSTEM_ADMIN_AUTHORITY;
import static ru.mycrg.auth_service_contract.Authorities.SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY;
import static ru.mycrg.common_utils.CrgGlobalProperties.prepareGeoserverLogin;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;

@RestController
@RequestMapping(value = "/organizations")
public class OrganizationController {

    private final Logger log = LoggerFactory.getLogger(OrganizationController.class);

    private final AESCryptor aesCryptor;
    private final AuthService authService;
    private final IMessageBusProducer messageBus;
    private final OrganizationService organizationService;

    @Autowired
    public OrganizationController(AESCryptor aesCryptor,
                                  AuthService authService,
                                  IMessageBusProducer messageBus,
                                  OrganizationService organizationService) {
        this.aesCryptor = aesCryptor;
        this.authService = authService;
        this.messageBus = messageBus;
        this.organizationService = organizationService;
    }

    @GetMapping
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> getAllOrganizations(Pageable pageable) {
        Page<OrganizationFullProjection> page = organizationService.getPaged(pageable);

        return ResponseEntity.ok(pageFromList(page, pageable));
    }

    @PostMapping("/init")
    public ResponseEntity<Object> createOrganization(@Valid @RequestBody OrganizationCreateDto createDto) {
        log.debug("Запрос на создание организации: {}", createDto);

        Organization newOrganization = organizationService.create(createDto);

        User owner = newOrganization.getUsers().stream().findFirst().orElseThrow();
        String rootAccessToken = authService.getRootAccessToken();
        String ownerAccessToken = authService.authorize(owner.getEmail(),
                                                        createDto.getOwner().getPassword()).getAccess_token();

        messageBus.produce(
                new OrganizationInitializedEvent(newOrganization.getId(),
                                                 rootAccessToken,
                                                 ownerAccessToken,
                                                 aesCryptor.encrypt(owner.getPassword()),
                                                 owner.getEmail(),
                                                 owner.getEmail(),
                                                 prepareGeoserverLogin(owner.getEmail(), owner.getId()),
                                                 createDto.getSpecializationId()));

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/{id}")
                .buildAndExpand(newOrganization.getId())
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(location);

        return ResponseEntity.accepted()
                             .headers(headers)
                             .body(newOrganization.getId());
    }

    @GetMapping("/{id}")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<OrganizationFullProjection> getOrganization(@PathVariable Long id) {
        OrganizationFullProjection projection = organizationService.findById(id);

        return ResponseEntity.ok(projection);
    }

    @PatchMapping("/{id}")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<OrganizationFullProjection> updateOrganization(@Valid
                                                                         @RequestBody OrganizationUpdateDto updateDto,
                                                                         @PathVariable Long id) {
        log.debug("Запрос на обновление организации: {} с данными: {}", id, updateDto);

        OrganizationFullProjection updatedOrganization = organizationService.update(updateDto, id);

        return ResponseEntity.ok(updatedOrganization);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(SYSTEM_ADMIN_AUTHORITY)
    public ResponseEntity<Object> deleteOrganization(@PathVariable Long id) {
        log.debug("Запрос на удаление организации: {}", id);

        organizationService.delete(id);

        return ResponseEntity.status(NO_CONTENT).build();
    }
}
