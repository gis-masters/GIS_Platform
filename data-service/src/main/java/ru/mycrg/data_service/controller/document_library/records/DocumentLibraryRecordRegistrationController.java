package ru.mycrg.data_service.controller.document_library.records;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.service.cqrs.library_records.requests.RegisterDocumentRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.mediator.Mediator;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY_RECORD;

@RestController
public class DocumentLibraryRecordRegistrationController {

    private final Logger log = LoggerFactory.getLogger(DocumentLibraryRecordRegistrationController.class);

    private final Mediator mediator;

    public DocumentLibraryRecordRegistrationController(Mediator mediator) {
        this.mediator = mediator;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/document-libraries/{docLibId}/records/{recId}/register")
    public ResponseEntity<String> register(@PathVariable String docLibId,
                                           @PathVariable Long recId) {
        log.debug("Request to registration document with id: {}", recId);

        String regNumber = mediator.execute(
                new RegisterDocumentRequest(
                        new ResourceQualifier(SYSTEM_SCHEMA_NAME, docLibId, recId, LIBRARY_RECORD)));

        return ResponseEntity.ok(regNumber);
    }
}
