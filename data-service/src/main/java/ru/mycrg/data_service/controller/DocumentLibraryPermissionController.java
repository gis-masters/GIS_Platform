package ru.mycrg.data_service.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.data_service.dto.PermissionCreateDto;
import ru.mycrg.data_service.dto.PermissionProjection;
import ru.mycrg.data_service.entity.Resource;
import ru.mycrg.data_service.exceptions.BindingErrorsException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;
import ru.mycrg.data_service.service.resources.ResourcesService;

import javax.validation.Valid;
import java.net.URI;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;

@RestController
public class DocumentLibraryPermissionController {

    private final ResourcesService resourcesService;
    private final PermissionsService permissionsService;

    public DocumentLibraryPermissionController(PermissionsService permissionsService,
                                               ResourcesService resourcesService) {
        this.resourcesService = resourcesService;
        this.permissionsService = permissionsService;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/document-libraries/{docLibId}/roleAssignment")
    public ResponseEntity<PermissionProjection> addPermissionToLibrary(@PathVariable String docLibId,
                                                                       @Valid @RequestBody PermissionCreateDto dto,
                                                                       BindingResult bindingResult,
                                                                       Authentication authentication) {
        if (bindingResult.hasErrors()) {
            throw new BindingErrorsException("Сущность описана некорректно", bindingResult);
        }

        ResourceIdentifier rIdentifier = new ResourceIdentifier(docLibId, LIBRARY);
        final Resource resource = resourcesService.get(rIdentifier, authentication)
                                                  .orElseThrow(() -> new NotFoundException(docLibId));
        final PermissionProjection permission = permissionsService.create(resource, dto);

        final URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/document-libraries/{docLibId}/roleAssignment/{id}")
                .buildAndExpand(docLibId, permission.getId())
                .toUri();

        return ResponseEntity.created(location).build();
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/document-libraries/{docLibId}/roleAssignment")
    public ResponseEntity<Object> getLibraryPermissions(@PathVariable String docLibId,
                                                        Pageable pageable,
                                                        PagedResourcesAssembler<PermissionProjection> pageAssembler,
                                                        Authentication authentication) {
        final Resource resource = resourcesService.get(new ResourceIdentifier(docLibId, LIBRARY), authentication)
                                                  .orElseThrow(() -> new NotFoundException(docLibId));
        final Page<PermissionProjection> permissions = permissionsService.getPaged(resource, pageable);

        final var pagedResources = pageAssembler.toResource(
                permissions,
                linkTo(DatasetPermissionsController.class)
                        .slash("/api/data/document-libraries/" + docLibId)
                        .withSelfRel());

        return ResponseEntity.ok(pagedResources);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @DeleteMapping("/document-libraries/{docLibId}/roleAssignment/{permissionId}")
    public ResponseEntity<Object> delete(@PathVariable String docLibId,
                                         @PathVariable Long permissionId,
                                         Authentication authentication) {
        final Resource resource = resourcesService.get(new ResourceIdentifier(docLibId, LIBRARY), authentication)
                                                  .orElseThrow(() -> new NotFoundException(docLibId));
        permissionsService.deleteById(resource, permissionId);

        return ResponseEntity.noContent().build();
    }
}
