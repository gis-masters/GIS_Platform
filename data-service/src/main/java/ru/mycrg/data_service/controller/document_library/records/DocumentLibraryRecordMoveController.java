package ru.mycrg.data_service.controller.document_library.records;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.service.cqrs.library_records.requests.MoveRecordToNewParentRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.mediator.Mediator;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;

@RestController
public class DocumentLibraryRecordMoveController {

    private final Mediator mediator;

    public DocumentLibraryRecordMoveController(Mediator mediator) {
        this.mediator = mediator;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/document-libraries/{docLibId}/records/{recordToMoveId}/move/{targetRecordId}")
    public ResponseEntity<Object> moveRecord(@PathVariable String docLibId,
                                             @PathVariable Long recordToMoveId,
                                             @PathVariable Long targetRecordId) {
        if (recordToMoveId.equals(targetRecordId)) {
            return ResponseEntity.ok().build();
        }

        mediator.execute(
                new MoveRecordToNewParentRequest(
                        ResourceQualifier.libraryRecordQualifier(docLibId, recordToMoveId),
                        targetRecordId != null
                                ? ResourceQualifier.libraryRecordQualifier(docLibId, targetRecordId)
                                : null
                )
        );

        return ResponseEntity.ok().build();
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/document-libraries/{docLibId}/records/{recId}/move")
    public ResponseEntity<Object> moveRecord(@PathVariable String docLibId,
                                             @PathVariable Long recId) {
        return moveRecord(docLibId, recId, null);
    }
}
