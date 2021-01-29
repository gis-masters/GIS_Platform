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
import ru.mycrg.data_service.exceptions.BindingErrorsException;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;

import javax.validation.Valid;
import java.net.URI;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.dto.ResourceType.SCHEMA;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;

@RestController
public class TablesPermissionsController {

    private final PermissionsService permissionsService;

    public TablesPermissionsController(PermissionsService permissionsService) {
        this.permissionsService = permissionsService;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/datasets/{dataSetId}/tables/{tableId}/roleAssignment")
    public ResponseEntity<PermissionProjection> addPermissionToTable(@PathVariable String dataSetId,
                                                                     @PathVariable String tableId,
                                                                     @Valid @RequestBody PermissionCreateDto dto,
                                                                     BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BindingErrorsException("Сущность описана некорректно", bindingResult);
        }

        ResourceIdentifier rIdentifier = new ResourceIdentifier(tableId, TABLE,
                                                                new ResourceIdentifier(dataSetId, SCHEMA));

        PermissionProjection permission = permissionsService.create(rIdentifier, dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/datasets/{dataSetId}/tables/{tableId}/roleAssignment/{id}")
                .buildAndExpand(dataSetId, tableId, permission.getId())
                .toUri();

        return ResponseEntity.created(location).build();
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/datasets/{dataSetId}/tables/{tableId}/roleAssignment")
    public ResponseEntity<Object> getTablePermissions(@PathVariable String dataSetId,
                                                      @PathVariable String tableId,
                                                      Pageable pageable,
                                                      PagedResourcesAssembler<PermissionProjection> pageAssembler) {
        ResourceIdentifier rIdentifier = new ResourceIdentifier(tableId, TABLE,
                                                                new ResourceIdentifier(dataSetId, SCHEMA));

        var permissions = permissionsService.getForResource(rIdentifier, pageable);

        var pagedResources = pageAssembler.toResource(
                permissions,
                linkTo(TablesPermissionsController.class)
                        .slash("/api/data/datasets/" + dataSetId + "/tables/" + tableId + "/roleAssignment")
                        .withSelfRel());

        return ResponseEntity.ok(pagedResources);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @DeleteMapping("/datasets/{dataSetId}/tables/{tableId}/roleAssignment/{permissionId}")
    public ResponseEntity<Object> deleteTablePermission(@PathVariable String dataSetId,
                                                        @PathVariable String tableId,
                                                        @PathVariable Long permissionId) {
        ResourceIdentifier rIdentifier = new ResourceIdentifier(tableId, TABLE,
                                                                new ResourceIdentifier(dataSetId, SCHEMA));

        permissionsService.deleteById(rIdentifier, permissionId);

        return ResponseEntity.noContent().build();
    }
}
