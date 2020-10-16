package ru.mycrg.data_service.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.dao.TablesDDL;
import ru.mycrg.data_service.dto.PermissionCreateDto;
import ru.mycrg.data_service.dto.PermissionProjection;
import ru.mycrg.data_service.dto.DatasetModel;
import ru.mycrg.data_service.exceptions.BindingErrorsException;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.TableIdentifier;

import javax.validation.Valid;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static ru.mycrg.data_service.config.Authorities.GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY;

@RestController
public class PermissionsController {

    private final TablesDDL tablesDDL;
    private final PermissionsService permissionsService;

    public PermissionsController(TablesDDL tablesDDL,
                                 PermissionsService permissionsService) {
        this.tablesDDL = tablesDDL;
        this.permissionsService = permissionsService;
    }

    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    @PostMapping("/datasets/{dataSetName}/tables/{tableName}/roleAssignment")
    public ResponseEntity<PermissionProjection> addPermission(@PathVariable String dataSetName,
                                                              @PathVariable String tableName,
                                                              @Valid @RequestBody PermissionCreateDto dto,
                                                              BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
             throw new BindingErrorsException("Сущность описана некорректно", bindingResult);
        }

        TableIdentifier tableIdentifier = new TableIdentifier(dataSetName, tableName);
        if (!tablesDDL.isTableExist(tableIdentifier)) {
            return ResponseEntity.notFound().build();
        }

        var permissionProjection = permissionsService.create(tableIdentifier, dto);

        return ResponseEntity.ok(permissionProjection);
    }

    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    @GetMapping("/datasets/{dataSetName}/tables/{tableName}/roleAssignment")
    public ResponseEntity<Object> getPermission(@PathVariable String dataSetName,
                                                @PathVariable String tableName,
                                                Pageable pageable,
                                                PagedResourcesAssembler pageAssembler) {
        TableIdentifier tableIdentifier = new TableIdentifier(dataSetName, tableName);
        if (!tablesDDL.isTableExist(tableIdentifier)) {
            return ResponseEntity.notFound().build();
        }

        var permissions = permissionsService.getForResource(tableIdentifier, pageable);

        PagedResources<DatasetModel> pagedResources = pageAssembler.toResource(permissions,
                linkTo(PermissionsController.class)
                        .slash("/api/data/datasets/" + dataSetName + "/tables/" + tableName + "/roleAssignment")
                        .withSelfRel());

        return ResponseEntity.ok(pagedResources);
    }

    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    @DeleteMapping("/datasets/{dataSetName}/tables/{tableName}/roleAssignment")
    public ResponseEntity<Object> deletePermission(@PathVariable String dataSetName,
                                                   @PathVariable String tableName) {
        TableIdentifier tableIdentifier = new TableIdentifier(dataSetName, tableName);
        if (!tablesDDL.isTableExist(tableIdentifier)) {
            return ResponseEntity.notFound().build();
        }

        permissionsService.deleteAllByResourceIdentifier(tableIdentifier);

        return ResponseEntity.noContent().build();
    }

    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    @DeleteMapping("/datasets/{dataSetName}/tables/{tableName}/roleAssignment/{permissionId}")
    public ResponseEntity<Object> deletePermission(@PathVariable String dataSetName,
                                                   @PathVariable String tableName,
                                                   @PathVariable Long permissionId) {
        TableIdentifier tableIdentifier = new TableIdentifier(dataSetName, tableName);
        if (!tablesDDL.isTableExist(tableIdentifier)) {
            return ResponseEntity.notFound().build();
        }

        permissionsService.deleteByPermissionId(tableIdentifier, permissionId);

        return ResponseEntity.noContent().build();
    }

}
