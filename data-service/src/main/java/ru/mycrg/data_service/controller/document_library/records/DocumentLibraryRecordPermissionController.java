package ru.mycrg.data_service.controller.document_library.records;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.data_service.dto.PermissionCreateDto;
import ru.mycrg.data_service.dto.PermissionProjection;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.exceptions.BindingErrorsException;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.cqrs.library_records.requests.CreatePermissionRequest;
import ru.mycrg.data_service.service.cqrs.library_records.requests.DeletePermissionRequest;
import ru.mycrg.data_service.service.document_library.RecordServiceFactory;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.mediator.Mediator;

import javax.validation.Valid;
import java.net.URI;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.libraryRecordQualifier;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.ID;

@RestController
public class DocumentLibraryRecordPermissionController {

    private final RecordServiceFactory recordServiceFactory;
    private final PermissionsService permissionsService;
    private final Mediator mediator;

    public DocumentLibraryRecordPermissionController(RecordServiceFactory recordServiceFactory,
                                                     PermissionsService permissionsService,
                                                     Mediator mediator) {
        this.recordServiceFactory = recordServiceFactory;
        this.permissionsService = permissionsService;
        this.mediator = mediator;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/document-libraries/{docLibId}/records/{recId}/roleAssignment")
    public ResponseEntity<Object> getLibraryPermissions(@PathVariable String docLibId,
                                                        @PathVariable Long recId,
                                                        Pageable pageable) {
        Page<PermissionProjection> permissions = permissionsService
                .getAllByResourceId(libraryRecordQualifier(docLibId, recId), pageable);

        return ResponseEntity.ok(pageFromList(permissions, pageable));
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

        ResourceQualifier rQualifier = libraryRecordQualifier(docLibId, recId);

        IRecord record = recordServiceFactory.get().getById(rQualifier, recId);
        Long recordId = Long.valueOf(record.getContent().get(ID.getName()).toString());

        PermissionProjection permission = mediator.execute(
                new CreatePermissionRequest(rQualifier, recordId, dto));

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
        mediator.execute(new DeletePermissionRequest(libraryRecordQualifier(docLibId, recId), permissionId));

        return ResponseEntity.noContent().build();
    }
}
