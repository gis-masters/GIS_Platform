package ru.mycrg.data_service.controller.document_library.records;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.dto.PermissionProjection;
import ru.mycrg.data_service.dto.integrations.IntegrationDto;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.dto.record.RecordEntity;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.document_library.RecordServiceFactory;
import ru.mycrg.data_service.service.integrations.IIntegrationHandler;

import java.util.List;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.libraryRecordQualifier;

@RestController
public class DocumentLibraryRecordIntegrationController {

    private final Logger log = LoggerFactory.getLogger(DocumentLibraryRecordIntegrationController.class);

    private final RecordServiceFactory recordServiceFactory;
    private final List<IIntegrationHandler> integrationHandlers;

    public DocumentLibraryRecordIntegrationController(RecordServiceFactory recordServiceFactory,
                                                      List<IIntegrationHandler> integrationHandlers) {
        this.recordServiceFactory = recordServiceFactory;
        this.integrationHandlers = integrationHandlers;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/document-libraries/{docLibId}/records/{recId}/integration")
    public ResponseEntity<PermissionProjection> addPermissionToLibrary(@PathVariable String docLibId,
                                                                       @PathVariable Long recId,
                                                                       @RequestBody IntegrationDto dto) {
        IRecord record = recordServiceFactory.get()
                                             .getById(libraryRecordQualifier(docLibId, recId), recId);

        try {
            integrationHandlers.stream()
                               .filter(handler -> handler.getType().equals(dto.getType()))
                               .findFirst()
                               .orElseThrow(() -> new BadRequestException("Неверно задан тип: " + dto.getType()))
                               .execute(new RecordEntity(record.getContent()));
        } catch (Exception e) {
            String msg = "Система электронного документооборота СЕД \"Диалог\" недоступна";
            log.error(msg);

            throw new DataServiceException(msg);
        }

        return ResponseEntity.accepted().build();
    }
}
