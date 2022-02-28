package ru.mycrg.data_service.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.data_service.dto.PermissionCreateDto;
import ru.mycrg.data_service.dto.PermissionProjection;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.exceptions.BindingErrorsException;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.records.RecordServiceFactory;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import javax.validation.Valid;
import java.net.URI;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.RECORD;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.ID;

@RestController
public class DocumentLibraryRecordPermissionController {

    private final RecordServiceFactory recordServiceFactory;
    private final PermissionsService permissionsService;

    public DocumentLibraryRecordPermissionController(RecordServiceFactory recordServiceFactory,
                                                     PermissionsService permissionsService) {
        this.recordServiceFactory = recordServiceFactory;
        this.permissionsService = permissionsService;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/document-libraries/{docLibId}/records/{recId}/roleAssignment")
    public ResponseEntity<Object> getLibraryPermissions(@PathVariable String docLibId,
                                                        @PathVariable Long recId,
                                                        Pageable pageable,
                                                        PagedResourcesAssembler<PermissionProjection> pageAssembler) {
        ResourceQualifier recordQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, docLibId, recId, RECORD);

        var permissions = permissionsService.getAllByResourceId(recordQualifier, pageable);

        var pagedResources = pageAssembler.toResource(
                permissions,
                linkTo(DatasetPermissionsController.class)
                        .slash("/api/data/document-libraries/" + docLibId)
                        .withSelfRel());

        return ResponseEntity.ok(pagedResources);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/document-libraries/{docLibId}/records/{recId}/roleAssignment")
    public ResponseEntity<PermissionProjection> addPermissionToLibrary(@PathVariable String docLibId,
                                                                       @PathVariable Long recId,
                                                                       @Valid @RequestBody PermissionCreateDto dto,
                                                                       BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BindingErrorsException("Сущность описана некорректно", bindingResult);
        }

        ResourceQualifier recordQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, docLibId, recId, RECORD);

        IRecord record = recordServiceFactory.get().getById(recordQualifier, recId);
        Long recordId = Long.valueOf(record.getContent().get(ID.getName()).toString());

        PermissionProjection permission = permissionsService.create(recordQualifier, recordId, dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/document-libraries/{docLibId}/roleAssignment/{id}")
                .buildAndExpand(docLibId, permission.getId())
                .toUri();

        return ResponseEntity.created(location).build();
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @DeleteMapping("/document-libraries/{docLibId}/records/{recId}/roleAssignment/{permissionId}")
    public ResponseEntity<Object> delete(@PathVariable String docLibId,
                                         @PathVariable Long recId,
                                         @PathVariable Long permissionId) {
        ResourceQualifier recordQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, docLibId, recId, RECORD);

        permissionsService.deleteById(recordQualifier, permissionId);

        return ResponseEntity.noContent().build();
    }
}
