package ru.mycrg.data_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.service.records.DocumentRegistrar;
import ru.mycrg.data_service.service.records.IDocumentRegistrar;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.RECORD;

@RestController
public class DocumentLibraryRecordRegistrationController {

    private final Logger log = LoggerFactory.getLogger(DocumentLibraryRecordRegistrationController.class);

    private final IDocumentRegistrar registrar;

    public DocumentLibraryRecordRegistrationController(DocumentRegistrar registrar) {
        this.registrar = registrar;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/document-libraries/{docLibId}/records/{recId}/register")
    public ResponseEntity<String> downloadBinary(@PathVariable String docLibId,
                                                 @PathVariable Long recId) {
        log.debug("Request to registration document with id: {}", recId);

        String regNumber = registrar.register(new ResourceQualifier(SYSTEM_SCHEMA_NAME, docLibId, recId, RECORD));

        return ResponseEntity.ok(regNumber);
    }
}
