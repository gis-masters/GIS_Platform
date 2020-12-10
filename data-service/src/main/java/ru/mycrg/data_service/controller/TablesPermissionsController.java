package ru.mycrg.data_service.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.data_service.dto.IResourceModel;
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

        PermissionProjection permission = permissionsService.create(rIdentifier, dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/datasets/{dataSetName}/tables/{tableName}/roleAssignment/{id}")
                .buildAndExpand(dataSetName, tableName, permission.getId())
                .toUri();

        return ResponseEntity.created(location).build();
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/datasets/{dataSetName}/tables/{tableName}/roleAssignment")
    public ResponseEntity<Object> getTablePermissions(@PathVariable String dataSetName,
                                                      @PathVariable String tableName,
                                                      Pageable pageable,
                                                      PagedResourcesAssembler pageAssembler) {
        ResourceIdentifier rIdentifier = new ResourceIdentifier(tableName, TABLE,
                                                                new ResourceIdentifier(dataSetName, SCHEMA));

        var permissions = permissionsService.getForResource(rIdentifier, pageable);

        PagedResources<IResourceModel> pagedResources = pageAssembler.toResource(
                permissions,
                linkTo(TablesPermissionsController.class)
                        .slash("/api/data/datasets/" + dataSetName + "/tables/" + tableName + "/roleAssignment")
                        .withSelfRel());

        return ResponseEntity.ok(pagedResources);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @DeleteMapping("/datasets/{dataSetName}/tables/{tableName}/roleAssignment/{permissionId}")
    public ResponseEntity<Object> deleteTablePermission(@PathVariable String dataSetName,
                                                        @PathVariable String tableName,
                                                        @PathVariable Long permissionId) {
        ResourceIdentifier rIdentifier = new ResourceIdentifier(tableName, TABLE,
                                                                new ResourceIdentifier(dataSetName, SCHEMA));

        permissionsService.deleteById(rIdentifier, permissionId);

        return ResponseEntity.noContent().build();
    }
}
