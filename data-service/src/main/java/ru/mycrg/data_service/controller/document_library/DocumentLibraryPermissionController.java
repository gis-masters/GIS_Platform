package ru.mycrg.data_service.controller.document_library;

import org.springframework.data.domain.Pageable;
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
import ru.mycrg.data_service.service.cqrs.library_records.requests.CreatePermissionRequest;
import ru.mycrg.data_service.service.cqrs.library_records.requests.DeletePermissionRequest;
import ru.mycrg.data_service.service.document_library.DocumentLibraryService;
import ru.mycrg.mediator.Mediator;

import javax.validation.Valid;
import java.net.URI;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.libraryQualifier;

@RestController
public class DocumentLibraryPermissionController {

    private final DocumentLibraryService librariesService;
    private final PermissionsService permissionsService;
    private final Mediator mediator;

    public DocumentLibraryPermissionController(DocumentLibraryService librariesService,
                                               PermissionsService permissionsService,
                                               Mediator mediator) {
        this.librariesService = librariesService;
        this.permissionsService = permissionsService;
        this.mediator = mediator;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/document-libraries/{docLibId}/roleAssignment")
    public ResponseEntity<Object> getLibraryPermissions(@PathVariable String docLibId,
                                                        Pageable pageable) {
        IResourceModel dl = librariesService.getInfo(docLibId);

        var permissions = permissionsService.getAllByResourceId(libraryQualifier(docLibId), dl.getId(), pageable);

        return ResponseEntity.ok(pageFromList(permissions, pageable));
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

        PermissionProjection permission = mediator.execute(
                new CreatePermissionRequest(libraryQualifier(docLibId), dl.getId(), dto));

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
        mediator.execute(
                new DeletePermissionRequest(libraryQualifier(docLibId), permissionId));

        return ResponseEntity.noContent().build();
    }
}
