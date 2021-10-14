package ru.mycrg.data_service.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.data_service.dto.PermissionProjection;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.PermissionCreateDto;
import ru.mycrg.data_service.exceptions.BindingErrorsException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.TableService;

import javax.validation.Valid;
import java.net.URI;
import java.util.ArrayList;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.service.resources.SchemasAndTablesBase.schemasAndTablesQualifier;

@RestController
public class TablesPermissionsController {

    private final TableService tableService;
    private final PermissionsService permissionsService;

    public TablesPermissionsController(TableService tableService,
                                       PermissionsService permissionsService) {
        this.tableService = tableService;

        this.permissionsService = permissionsService;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/datasets/{datasetId}/tables/{tableId}/roleAssignment")
    public ResponseEntity<PermissionsService> addPermissionToTable(@PathVariable String datasetId,
                                                                   @PathVariable String tableId,
                                                                   @Valid @RequestBody PermissionCreateDto dto,
                                                                   BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BindingErrorsException("Сущность описана некорректно", bindingResult);
        }

        final IResourceModel table = tableService.getInfo(new ResourceQualifier(datasetId, tableId));

        final PermissionProjection permission = permissionsService
                .create(schemasAndTablesQualifier, table.getId(), dto);

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
        Page<PermissionProjection> permissions;
        try {
            final IResourceModel table = tableService.getInfo(new ResourceQualifier(datasetId, tableId));

            permissions = permissionsService.getAllByResourceId(schemasAndTablesQualifier, table.getId(), pageable);
        } catch (ForbiddenException e) {
            permissions = new PageImpl<>(new ArrayList<>());
        }

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
        permissionsService.deleteById(schemasAndTablesQualifier, permissionId);

        return ResponseEntity.noContent().build();
    }
}
