package ru.mycrg.data_service.controller;

import org.springframework.data.domain.Page;
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

@RestController
public class DatasetPermissionsController {

    private final ResourcesService resourcesService;
    private final PermissionsService permissionsService;

    public DatasetPermissionsController(PermissionsService permissionsService,
                                        ResourcesService resourcesService) {
        this.resourcesService = resourcesService;
        this.permissionsService = permissionsService;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/datasets/{datasetId}/roleAssignment")
    public ResponseEntity<PermissionProjection> addPermissionToDataset(@PathVariable String datasetId,
                                                                       @Valid @RequestBody PermissionCreateDto dto,
                                                                       BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BindingErrorsException("Сущность описана некорректно", bindingResult);
        }

        Resource resource = resourcesService.get(new ResourceIdentifier(datasetId, SCHEMA))
                                            .orElseThrow(() -> new NotFoundException(datasetId));
        PermissionProjection permission = permissionsService.create(resource, dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/datasets/{datasetId}/roleAssignment/{id}")
                .buildAndExpand(datasetId, permission.getId())
                .toUri();

        return ResponseEntity.created(location).build();
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/datasets/{datasetId}/roleAssignment")
    public ResponseEntity<Object> getDatasetPermissions(@PathVariable String datasetId,
                                                        Pageable pageable,
                                                        PagedResourcesAssembler<PermissionProjection> pageAssembler) {
        Resource resource = resourcesService.get(new ResourceIdentifier(datasetId, SCHEMA))
                                            .orElseThrow(() -> new NotFoundException(datasetId));
        final Page<PermissionProjection> permissions = permissionsService.getPaged(resource, pageable);

        final var pagedResources = pageAssembler.toResource(
                permissions,
                linkTo(DatasetPermissionsController.class)
                        .slash("/api/data/datasets/" + datasetId)
                        .withSelfRel());

        return ResponseEntity.ok(pagedResources);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @DeleteMapping("/datasets/{datasetId}/roleAssignment/{permissionId}")
    public ResponseEntity<Object> deleteDatasetPermission(@PathVariable String datasetId,
                                                          @PathVariable Long permissionId) {
        Resource resource = resourcesService.get(new ResourceIdentifier(datasetId, SCHEMA))
                                            .orElseThrow(() -> new NotFoundException(datasetId));
        permissionsService.deleteById(resource, permissionId);

        return ResponseEntity.noContent().build();
    }
}
