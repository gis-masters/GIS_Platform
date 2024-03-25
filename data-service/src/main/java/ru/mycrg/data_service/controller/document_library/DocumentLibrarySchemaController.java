package ru.mycrg.data_service.controller.document_library;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.service.cqrs.libraries.requests.UpdateDocLibrarySchemaRequest;
import ru.mycrg.data_service.service.document_library.DocumentLibraryService;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.Mediator;

import javax.validation.Valid;

import static org.springframework.http.HttpStatus.OK;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.libraryQualifier;

@RestController
public class DocumentLibrarySchemaController {

    private final Mediator mediator;
    private final DocumentLibraryService librariesService;

    public DocumentLibrarySchemaController(Mediator mediator,
                                           DocumentLibraryService librariesService) {
        this.mediator = mediator;
        this.librariesService = librariesService;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/document-libraries/{docLibId}/schema")
    public ResponseEntity<SchemaDto> getDocLibrarySchema(@PathVariable String docLibId) {
        SchemaDto schema = librariesService.getSchema(docLibId);

        return ResponseEntity.ok(schema);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PutMapping("/document-libraries/{docLibId}/schema")
    public ResponseEntity<?> updateDocLibrarySchema(@PathVariable String docLibId,
                                                    @Valid @RequestBody SchemaDto dto) {
        mediator.execute(new UpdateDocLibrarySchemaRequest(libraryQualifier(docLibId), dto));

        return ResponseEntity.status(OK).build();
    }
}
