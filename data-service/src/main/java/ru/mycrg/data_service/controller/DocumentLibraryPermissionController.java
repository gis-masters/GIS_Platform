package ru.mycrg.data_service.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.PermissionCreateDto;
import ru.mycrg.data_service.dto.PermissionProjection;
import ru.mycrg.data_service.exceptions.BindingErrorsException;
import ru.mycrg.data_service.service.DocumentLibraryService;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import javax.validation.Valid;
import java.net.URI;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;

@RestController
public class DocumentLibraryPermissionController {

    private final DocumentLibraryService librariesService;
    private final PermissionsService permissionsService;

    public DocumentLibraryPermissionController(DocumentLibraryService librariesService,
                                               PermissionsService permissionsService) {
        this.librariesService = librariesService;
        this.permissionsService = permissionsService;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/document-libraries/{docLibId}/roleAssignment")
    public ResponseEntity<Object> getLibraryPermissions(@PathVariable String docLibId,
                                                        Pageable pageable,
                                                        PagedResourcesAssembler<PermissionProjection> pageAssembler) {
        IResourceModel dl = librariesService.getInfo(docLibId);

        ResourceQualifier dlQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, docLibId, LIBRARY);
        var permissions = permissionsService.getAllByResourceId(dlQualifier, dl.getId(), pageable);

        var pagedResources = pageAssembler.toResource(
                permissions,
                linkTo(DatasetPermissionsController.class)
                        .slash("/api/data/document-libraries/" + docLibId)
                        .withSelfRel());

        return ResponseEntity.ok(pagedResources);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/document-libraries/{docLibId}/roleAssignment")
    public ResponseEntity<PermissionProjection> addPermissionToLibrary(@PathVariable String docLibId,
                                                                       @Valid @RequestBody PermissionCreateDto dto,
                                                                       BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BindingErrorsException("Сущность описана некорректно", bindingResult);
        }

        IResourceModel dl = librariesService.getInfo(docLibId);

        ResourceQualifier dlQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, docLibId, LIBRARY);
        PermissionProjection permission = permissionsService.create(dlQualifier, dl.getId(), dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/document-libraries/{docLibId}/roleAssignment/{id}")
                .buildAndExpand(docLibId, permission.getId())
                .toUri();

        return ResponseEntity.created(location).build();
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @DeleteMapping("/document-libraries/{docLibId}/roleAssignment/{permissionId}")
    public ResponseEntity<Object> delete(@PathVariable String docLibId,
                                         @PathVariable Long permissionId) {
        permissionsService.deleteById(new ResourceQualifier(SYSTEM_SCHEMA_NAME, docLibId, LIBRARY), permissionId);

        return ResponseEntity.noContent().build();
    }
}
