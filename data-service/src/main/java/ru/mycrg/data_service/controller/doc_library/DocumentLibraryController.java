package ru.mycrg.data_service.controller.doc_library;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.LibraryCreateDto;
import ru.mycrg.data_service.dto.LibraryModel;
import ru.mycrg.data_service.service.DocumentLibraryService;
import ru.mycrg.data_service.service.cqrs.libraries.requests.CreateLibraryRequest;
import ru.mycrg.data_service.service.cqrs.libraries.requests.DeleteLibraryRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.mediator.Mediator;

import javax.validation.Valid;

import static org.springframework.http.HttpStatus.CREATED;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.auth_service_contract.Authorities.ORG_ADMIN_AUTHORITY;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;

@RestController
public class DocumentLibraryController {

    private final DocumentLibraryService librariesService;
    private final Mediator mediator;

    public DocumentLibraryController(DocumentLibraryService librariesService, Mediator mediator) {
        this.librariesService = librariesService;
        this.mediator = mediator;
    }

    @GetMapping("/document-libraries")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> getPagedWithFilter(@RequestParam(name = "filter", required = false) String ecqlFilter,
                                                     Pageable pageable) {
        Page<LibraryModel> libraries = librariesService.getPaged(ecqlFilter, pageable);

        return ResponseEntity.ok(pageFromList(libraries, pageable));
    }

    @GetMapping("/document-libraries/{docLibId}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<IResourceModel> getLibrary(@PathVariable String docLibId) {
        IResourceModel dl = librariesService.getInfo(docLibId);

        return ResponseEntity.ok(dl);
    }

    @GetMapping("/document-libraries/{docLibId}/schema")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public Object getLibrarySchema(@PathVariable String docLibId) {
        return librariesService.getSchema(docLibId);
    }

    @PreAuthorize(ORG_ADMIN_AUTHORITY)
    @PostMapping("/document-libraries")
    public ResponseEntity<IResourceModel> createLibrary(@Valid @RequestBody LibraryCreateDto dto) {
        IResourceModel documentLibrary = mediator.execute(new CreateLibraryRequest(dto));

        return new ResponseEntity<>(documentLibrary, CREATED);
    }

    @PreAuthorize(ORG_ADMIN_AUTHORITY)
    @DeleteMapping("/document-libraries/{libraryName}")
    public ResponseEntity<Void> deleteLibrary(@PathVariable String libraryName) {
        mediator.execute(new DeleteLibraryRequest(new ResourceQualifier("data", libraryName)));

        return ResponseEntity.noContent().build();
    }
}