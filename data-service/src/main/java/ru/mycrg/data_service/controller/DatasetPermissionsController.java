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

@RestController
public class DatasetPermissionsController {

    private final PermissionsService permissionsService;

    public DatasetPermissionsController(PermissionsService permissionsService) {
        this.permissionsService = permissionsService;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/datasets/{dataSetName}/roleAssignment")
    public ResponseEntity<PermissionProjection> addPermissionToDataset(@PathVariable String dataSetName,
                                                                       @Valid @RequestBody PermissionCreateDto dto,
                                                                       BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BindingErrorsException("Сущность описана некорректно", bindingResult);
        }

        final ResourceIdentifier resIdentifier = new ResourceIdentifier(dataSetName, SCHEMA);

        PermissionProjection permission = permissionsService.create(resIdentifier, dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/datasets/{dataSetName}/roleAssignment/{id}")
                .buildAndExpand(dataSetName, permission.getId())
                .toUri();

        return ResponseEntity.created(location).build();
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/datasets/{dataSetName}/roleAssignment")
    public ResponseEntity<Object> getDatasetPermissions(@PathVariable String dataSetName,
                                                        Pageable pageable,
                                                        PagedResourcesAssembler pageAssembler) {
        var permissions = permissionsService.getForResource(new ResourceIdentifier(dataSetName, SCHEMA), pageable);

        PagedResources<IResourceModel> pagedResources = pageAssembler.toResource(
                permissions,
                linkTo(DatasetPermissionsController.class)
                        .slash("/api/data/datasets/" + dataSetName)
                        .withSelfRel());

        return ResponseEntity.ok(pagedResources);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @DeleteMapping("/datasets/{dataSetName}/roleAssignment/{permissionId}")
    public ResponseEntity<Object> deleteDatasetPermission(@PathVariable String dataSetName,
                                                          @PathVariable Long permissionId) {
        permissionsService.deleteById(new ResourceIdentifier(dataSetName, SCHEMA), permissionId);

        return ResponseEntity.noContent().build();
    }
}
