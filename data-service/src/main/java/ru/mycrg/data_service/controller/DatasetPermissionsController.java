package ru.mycrg.data_service.controller;

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
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.resources.DatasetService;

import javax.validation.Valid;
import java.net.URI;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.service.resources.SchemasAndTablesBase.schemasAndTablesQualifier;

@RestController
public class DatasetPermissionsController {

    private final DatasetService datasetService;
    private final PermissionsService permissionsService;

    public DatasetPermissionsController(DatasetService datasetService,
                                        PermissionsService permissionsService) {
        this.datasetService = datasetService;
        this.permissionsService = permissionsService;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/datasets/{datasetId}/roleAssignment")
    public ResponseEntity<Object> getDatasetPermissions(@PathVariable String datasetId,
                                                        Pageable pageable,
                                                        PagedResourcesAssembler<PermissionProjection> pageAssembler) {
        final IResourceModel dataset = datasetService.getInfo(datasetId);

        final var permissions = permissionsService.getAllByResourceId(schemasAndTablesQualifier, dataset.getId(), pageable);

        final var pagedResources = pageAssembler.toResource(permissions);

        return ResponseEntity.ok(pagedResources);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/datasets/{datasetId}/roleAssignment")
    public ResponseEntity<PermissionProjection> addPermissionToDataset(@PathVariable String datasetId,
                                                                       @Valid @RequestBody PermissionCreateDto dto,
                                                                       BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BindingErrorsException("Сущность описана некорректно", bindingResult);
        }

        final IResourceModel dataset = datasetService.getInfo(datasetId);

        PermissionProjection permission = permissionsService
                .create(schemasAndTablesQualifier, dataset.getId(), dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/datasets/{datasetId}/roleAssignment/{id}")
                .buildAndExpand(datasetId, permission.getId())
                .toUri();

        return ResponseEntity.created(location).build();
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @DeleteMapping("/datasets/{datasetId}/roleAssignment/{permissionId}")
    public ResponseEntity<Object> deleteDatasetPermission(@PathVariable String datasetId,
                                                          @PathVariable Long permissionId) {
        permissionsService.deleteById(permissionId);

        return ResponseEntity.noContent().build();
    }
}
