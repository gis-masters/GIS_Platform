package ru.mycrg.data_service.controller.document_library;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.LibraryCreateDto;
import ru.mycrg.data_service.dto.LibraryModel;
import ru.mycrg.data_service.dto.LibraryUpdateDto;
import ru.mycrg.data_service.service.cqrs.libraries.requests.CreateLibraryRequest;
import ru.mycrg.data_service.service.cqrs.libraries.requests.DeleteLibraryRequest;
import ru.mycrg.data_service.service.cqrs.libraries.requests.UpdateLibraryRequest;
import ru.mycrg.data_service.service.document_library.DocumentLibraryService;
import ru.mycrg.mediator.Mediator;

import javax.validation.Valid;

import static org.springframework.http.HttpStatus.CREATED;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.auth_service_contract.Authorities.ORG_ADMIN_AUTHORITY;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.libraryQualifier;

@RestController
public class DocumentLibraryController {

    private final Mediator mediator;
    private final DocumentLibraryService librariesService;

    public DocumentLibraryController(Mediator mediator,
                                     DocumentLibraryService librariesService) {
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

    @PreAuthorize(ORG_ADMIN_AUTHORITY)
    @PostMapping("/document-libraries")
    public ResponseEntity<IResourceModel> createLibrary(@Valid @RequestBody LibraryCreateDto dto) {
        IResourceModel documentLibrary = mediator.execute(new CreateLibraryRequest(dto));

        return new ResponseEntity<>(documentLibrary, CREATED);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PutMapping("/document-libraries/{docLibId}")
    public ResponseEntity<IResourceModel> updateTable(@PathVariable String docLibId,
                                                      @Valid @RequestBody LibraryUpdateDto dto) {
        mediator.execute(new UpdateLibraryRequest(libraryQualifier(docLibId), dto));

        return ResponseEntity.ok().build();
    }

    @PreAuthorize(ORG_ADMIN_AUTHORITY)
    @DeleteMapping("/document-libraries/{docLibId}")
    public ResponseEntity<Void> deleteLibrary(@PathVariable String docLibId) {
        mediator.execute(new DeleteLibraryRequest(libraryQualifier(docLibId)));

        return ResponseEntity.noContent().build();
    }
}