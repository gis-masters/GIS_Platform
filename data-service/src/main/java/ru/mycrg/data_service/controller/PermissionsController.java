package ru.mycrg.data_service.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.data_service.dto.DatasetModel;
import ru.mycrg.data_service.dto.PermissionCreateDto;
import ru.mycrg.data_service.dto.PermissionProjection;
import ru.mycrg.data_service.exceptions.BindingErrorsException;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;

import javax.validation.Valid;
import java.net.URI;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static ru.mycrg.auth_service_contract.Authorities.GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY;
import static ru.mycrg.data_service.dto.ResourceType.SCHEMA;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;

@RestController
public class PermissionsController {

    private final PermissionsService permissionsService;

    public PermissionsController(PermissionsService permissionsService) {
        this.permissionsService = permissionsService;
    }

    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    @PostMapping("/datasets/{dataSetName}/roleAssignment")
    public ResponseEntity<Object> addPermissionToDataset(@PathVariable String dataSetName,
                                                         @Valid @RequestBody PermissionCreateDto dto,
                                                         BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BindingErrorsException("Сущность описана некорректно", bindingResult);
        }

        PermissionProjection permission = permissionsService.create(new ResourceIdentifier(dataSetName, SCHEMA), dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/datasets/{dataSetName}/roleAssignment/{id}")
                .buildAndExpand(dataSetName, permission.getId())
                .toUri();

        return ResponseEntity.created(location).build();
    }

    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    @GetMapping("/datasets/{dataSetName}/roleAssignment")
    public ResponseEntity<Object> getDatasetPermissions(@PathVariable String dataSetName,
                                                        Pageable pageable,
                                                        PagedResourcesAssembler pageAssembler) {
        var permissions = permissionsService.getForResource(new ResourceIdentifier(dataSetName, SCHEMA), pageable);

        PagedResources<DatasetModel> pagedResources = pageAssembler.toResource(
                permissions,
                linkTo(PermissionsController.class)
                        .slash("/api/data/datasets/" + dataSetName)
                        .withSelfRel());

        return ResponseEntity.ok(pagedResources);
    }

    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    @DeleteMapping("/datasets/{dataSetName}/roleAssignment")
    public ResponseEntity<Object> deleteAllDatasetPermissions(@PathVariable String dataSetName) {
        permissionsService.deleteAllByResourceIdentifier(new ResourceIdentifier(dataSetName, SCHEMA));

        return ResponseEntity.noContent().build();
    }

    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    @DeleteMapping("/datasets/{dataSetName}/roleAssignment/{permissionId}")
    public ResponseEntity<Object> deleteDatasetPermission(@PathVariable String dataSetName,
                                                          @PathVariable Long permissionId) {
        permissionsService.deleteByPermissionId(new ResourceIdentifier(dataSetName, SCHEMA), permissionId);

        return ResponseEntity.noContent().build();
    }

    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    @PostMapping("/datasets/{dataSetName}/tables/{tableName}/roleAssignment")
    public ResponseEntity<PermissionProjection> addPermissionToTable(@PathVariable String dataSetName,
                                                                     @PathVariable String tableName,
                                                                     @Valid @RequestBody PermissionCreateDto dto,
                                                                     BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BindingErrorsException("Сущность описана некорректно", bindingResult);
        }

        ResourceIdentifier rIdentifier = new ResourceIdentifier(tableName, TABLE,
                                                                new ResourceIdentifier(dataSetName, SCHEMA));

        var permission = permissionsService.create(rIdentifier, dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/datasets/{dataSetName}/tables/{tableName}/roleAssignment/{id}")
                .buildAndExpand(dataSetName, tableName, permission.getId())
                .toUri();

        return ResponseEntity.created(location).build();
    }

    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    @GetMapping("/datasets/{dataSetName}/tables/{tableName}/roleAssignment")
    public ResponseEntity<Object> getTablePermissions(@PathVariable String dataSetName,
                                                      @PathVariable String tableName,
                                                      Pageable pageable,
                                                      PagedResourcesAssembler pageAssembler) {
        ResourceIdentifier rIdentifier = new ResourceIdentifier(tableName, TABLE,
                                                                new ResourceIdentifier(dataSetName, SCHEMA));

        var permissions = permissionsService.getForResource(rIdentifier, pageable);

        PagedResources<DatasetModel> pagedResources = pageAssembler.toResource(
                permissions,
                linkTo(PermissionsController.class)
                        .slash("/api/data/datasets/" + dataSetName + "/tables/" + tableName + "/roleAssignment")
                        .withSelfRel());

        return ResponseEntity.ok(pagedResources);
    }

    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    @DeleteMapping("/datasets/{dataSetName}/tables/{tableName}/roleAssignment")
    public ResponseEntity<Object> deleteAllTablePermissions(@PathVariable String dataSetName,
                                                            @PathVariable String tableName) {
        ResourceIdentifier rIdentifier = new ResourceIdentifier(tableName, TABLE,
                                                                new ResourceIdentifier(dataSetName, SCHEMA));

        permissionsService.deleteAllByResourceIdentifier(rIdentifier);

        return ResponseEntity.noContent().build();
    }

    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    @DeleteMapping("/datasets/{dataSetName}/tables/{tableName}/roleAssignment/{permissionId}")
    public ResponseEntity<Object> deleteTablePermission(@PathVariable String dataSetName,
                                                        @PathVariable String tableName,
                                                        @PathVariable Long permissionId) {
        ResourceIdentifier rIdentifier = new ResourceIdentifier(tableName, TABLE,
                                                                new ResourceIdentifier(dataSetName, SCHEMA));

        permissionsService.deleteByPermissionId(rIdentifier, permissionId);

        return ResponseEntity.noContent().build();
    }
}
