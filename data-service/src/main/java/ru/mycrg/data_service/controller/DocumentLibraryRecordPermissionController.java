package ru.mycrg.data_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import ru.mycrg.data_service.service.RecordsService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import javax.validation.Valid;
import java.net.URI;
import java.util.Map;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.dao.CrgDataSourcesPool.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.ID;

@RestController
public class DocumentLibraryRecordPermissionController {

    public static final Logger log = LoggerFactory.getLogger(DocumentLibraryRecordPermissionController.class);

    private final RecordsService recordsService;
    private final PermissionsService permissionsService;

    public DocumentLibraryRecordPermissionController(RecordsService recordsService,
                                                     PermissionsService permissionsService) {
        this.recordsService = recordsService;
        this.permissionsService = permissionsService;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/document-libraries/{docLibId}/records/{recId}/roleAssignment")
    public ResponseEntity<PermissionProjection> addPermissionToLibrary(@PathVariable String docLibId,
                                                                       @Valid @RequestBody PermissionCreateDto dto,
                                                                       @PathVariable Long recId,
                                                                       BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BindingErrorsException("Сущность описана некорректно", bindingResult);
        }

        ResourceQualifier libraryQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, docLibId);

        final Map<String, Object> record = recordsService.getById(libraryQualifier, recId);
        final Long recordId = Long.valueOf(record.get(ID.getName()).toString());

        final PermissionProjection permission = permissionsService.create(libraryQualifier, recordId, dto);

        final URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/document-libraries/{docLibId}/roleAssignment/{id}")
                .buildAndExpand(docLibId, permission.getId())
                .toUri();

        return ResponseEntity.created(location).build();
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/document-libraries/{docLibId}/records/{recId}/roleAssignment")
    public ResponseEntity<Object> getLibraryPermissions(@PathVariable String docLibId,
                                                        Pageable pageable,
                                                        @PathVariable Long recId,
                                                        PagedResourcesAssembler<PermissionProjection> pageAssembler) {
        ResourceQualifier libraryQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, docLibId);

        final Map<String, Object> record = recordsService.getById(libraryQualifier, recId);
        final Long recordId = Long.valueOf(record.get(ID.getName()).toString());

        final var permissions = permissionsService.getAllByResourceId(libraryQualifier, recordId, pageable);

        final var pagedResources = pageAssembler.toResource(
                permissions,
                linkTo(DatasetPermissionsController.class)
                        .slash("/api/data/document-libraries/" + docLibId)
                        .withSelfRel());

        return ResponseEntity.ok(pagedResources);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @DeleteMapping("/document-libraries/{docLibId}/records/{recId}/roleAssignment/{permissionId}")
    public ResponseEntity<Object> delete(@PathVariable Long permissionId) {
        permissionsService.deleteById(permissionId);

        return ResponseEntity.noContent().build();
    }
}
