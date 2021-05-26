package ru.mycrg.data_service.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
import static ru.mycrg.data_service.dto.ResourceType.SCHEMA;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;

@RestController
public class TablesPermissionsController {

    private final PermissionsService permissionsService;
    private final ResourcesService resourcesService;

    public TablesPermissionsController(PermissionsService permissionsService,
                                       ResourcesService resourcesService) {
        this.resourcesService = resourcesService;
        this.permissionsService = permissionsService;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/datasets/{datasetId}/tables/{tableId}/roleAssignment")
    public ResponseEntity<PermissionProjection> addPermissionToTable(@PathVariable String datasetId,
                                                                     @PathVariable String tableId,
                                                                     @Valid @RequestBody PermissionCreateDto dto,
                                                                     BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BindingErrorsException("Сущность описана некорректно", bindingResult);
        }

        final ResourceIdentifier rIdentifier = new ResourceIdentifier(tableId, TABLE, datasetId, SCHEMA);
        final Resource resource = resourcesService.get(rIdentifier)
                                                  .orElseThrow(() -> new NotFoundException(rIdentifier.toString()));

        final PermissionProjection permission = permissionsService.create(resource, dto);

        final URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/datasets/{datasetId}/tables/{tableId}/roleAssignment/{id}")
                .buildAndExpand(datasetId, tableId, permission.getId())
                .toUri();

        return ResponseEntity.created(location).build();
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/datasets/{datasetId}/tables/{tableId}/roleAssignment")
    public ResponseEntity<Object> getTablePermissions(@PathVariable String datasetId,
                                                      @PathVariable String tableId,
                                                      Pageable pageable,
                                                      PagedResourcesAssembler<PermissionProjection> pageAssembler) {
        final ResourceIdentifier rIdentifier = new ResourceIdentifier(tableId, TABLE, datasetId, SCHEMA);
        final Resource resource = resourcesService.get(rIdentifier)
                                                  .orElseThrow(() -> new NotFoundException(rIdentifier.toString()));

        final var permissions = permissionsService.getPaged(resource, pageable);

        final var pagedResources = pageAssembler.toResource(
                permissions,
                linkTo(TablesPermissionsController.class)
                        .slash("/api/data/datasets/" + datasetId + "/tables/" + tableId + "/roleAssignment")
                        .withSelfRel());

        return ResponseEntity.ok(pagedResources);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @DeleteMapping("/datasets/{datasetId}/tables/{tableId}/roleAssignment/{permissionId}")
    public ResponseEntity<Object> deleteTablePermission(@PathVariable String datasetId,
                                                        @PathVariable String tableId,
                                                        @PathVariable Long permissionId) {
        final ResourceIdentifier rIdentifier = new ResourceIdentifier(tableId, TABLE, datasetId, SCHEMA);
        final Resource resource = resourcesService.get(rIdentifier)
                                                  .orElseThrow(() -> new NotFoundException(rIdentifier.toString()));

        permissionsService.deleteById(resource, permissionId);

        return ResponseEntity.noContent().build();
    }
}
