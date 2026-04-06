package ru.mycrg.auth_service.controller;

import org.jetbrains.annotations.NotNull;
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
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.exceptions.ConflictException;
import ru.mycrg.auth_service.repository.UserRepository;
import ru.mycrg.auth_service.service.organization.OrganizationInitializer;
import ru.mycrg.auth_service.service.organization.OrganizationService;
import ru.mycrg.auth_service_contract.dto.OrganizationCreateDto;
import ru.mycrg.auth_service_contract.dto.OrganizationUpdateDto;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.Optional;

import static org.springframework.http.HttpStatus.NO_CONTENT;
import static ru.mycrg.auth_service_contract.Authorities.SYSTEM_ADMIN_AUTHORITY;
import static ru.mycrg.auth_service_contract.Authorities.SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;

@RestController
@RequestMapping(value = "/organizations")
public class OrganizationController {

    private final Logger log = LoggerFactory.getLogger(OrganizationController.class);

    private final UserRepository userRepository;
    private final OrganizationService organizationService;
    private final OrganizationInitializer organizationInitializer;

    @Autowired
    public OrganizationController(UserRepository userRepository,
                                  OrganizationService organizationService,
                                  OrganizationInitializer organizationInitializer) {
        this.userRepository = userRepository;
        this.organizationService = organizationService;
        this.organizationInitializer = organizationInitializer;
    }

    @GetMapping
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<?> getAllOrganizations(Pageable pageable) {
        Page<OrganizationFullProjection> page = organizationService.getPaged(pageable);

        return ResponseEntity.ok(pageFromList(page, pageable));
    }

    @PostMapping("/init")
    public ResponseEntity<Long> createOrganization(@Valid @RequestBody OrganizationCreateDto createDto) {
        log.debug("Запрос на создание организации: {}", createDto);

        UserCreateDto owner = createDto.getOwner();
        Optional<User> userByEmail = userRepository.findByEmailIgnoreCase(owner.getEmail());
        if (userByEmail.isPresent()) {
            throw new ConflictException(String.format("email: '%s' уже занят", owner.getEmail()));
        }

        Long orgId = organizationInitializer.initialize(createDto);

        return ResponseEntity.accepted()
                             .headers(buildHeaders(orgId))
                             .body(orgId);
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
    public ResponseEntity<?> deleteOrganization(@PathVariable Long id) {
        log.debug("Запрос на удаление организации: {}", id);

        organizationService.delete(id);

        return ResponseEntity.status(NO_CONTENT).build();
    }

    @NotNull
    private HttpHeaders buildHeaders(Long orgId) {
        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/{id}")
                .buildAndExpand(orgId)
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(location);

        return headers;
    }
}
