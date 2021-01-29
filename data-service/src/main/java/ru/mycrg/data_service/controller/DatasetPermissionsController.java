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
import ru.mycrg.data_service.exceptions.BindingErrorsException;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;

import javax.validation.Valid;
import java.net.URI;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.dto.ResourceType.SCHEMA;

@RestController
public class DatasetPermissionsController {

    private final PermissionsService permissionsService;

    public DatasetPermissionsController(PermissionsService permissionsService) {
        this.permissionsService = permissionsService;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/datasets/{dataSetId}/roleAssignment")
    public ResponseEntity<PermissionProjection> addPermissionToDataset(@PathVariable String dataSetId,
                                                                       @Valid @RequestBody PermissionCreateDto dto,
                                                                       BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BindingErrorsException("Сущность описана некорректно", bindingResult);
        }

        final ResourceIdentifier resIdentifier = new ResourceIdentifier(dataSetId, SCHEMA);

        PermissionProjection permission = permissionsService.create(resIdentifier, dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/datasets/{dataSetId}/roleAssignment/{id}")
                .buildAndExpand(dataSetId, permission.getId())
                .toUri();

        return ResponseEntity.created(location).build();
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/datasets/{dataSetId}/roleAssignment")
    public ResponseEntity<Object> getDatasetPermissions(@PathVariable String dataSetId,
                                                        Pageable pageable,
                                                        PagedResourcesAssembler<PermissionProjection> pageAssembler) {
        final Page<PermissionProjection> permissions = permissionsService.getForResource(
                new ResourceIdentifier(dataSetId, SCHEMA), pageable);

        final var pagedResources = pageAssembler.toResource(
                permissions,
                linkTo(DatasetPermissionsController.class)
                        .slash("/api/data/datasets/" + dataSetId)
                        .withSelfRel());

        return ResponseEntity.ok(pagedResources);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @DeleteMapping("/datasets/{dataSetId}/roleAssignment/{permissionId}")
    public ResponseEntity<Object> deleteDatasetPermission(@PathVariable String dataSetId,
                                                          @PathVariable Long permissionId) {
        permissionsService.deleteById(new ResourceIdentifier(dataSetId, SCHEMA), permissionId);

        return ResponseEntity.noContent().build();
    }
}
