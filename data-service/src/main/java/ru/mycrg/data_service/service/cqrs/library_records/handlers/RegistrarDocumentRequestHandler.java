package ru.mycrg.data_service.service.cqrs.library_records.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.BasePermissionsRepository;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.dto.record.RecordEntity;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.service.document_library.DocumentLibraryService;
import ru.mycrg.data_service.service.cqrs.library_records.requests.RegisterDocumentRequest;
import ru.mycrg.data_service.service.document_library.IRecordsService;
import ru.mycrg.data_service.service.document_library.RecordServiceFactory;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequestHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static java.time.LocalDateTime.now;

@Component
public class RegistrarDocumentRequestHandler implements IRequestHandler<RegisterDocumentRequest, String> {

    private final DocumentLibraryService librariesService;
    private final RecordServiceFactory recordServiceFactory;
    private final BasePermissionsRepository permissionsRepository;

    public RegistrarDocumentRequestHandler(DocumentLibraryService librariesService,
                                           RecordServiceFactory recordServiceFactory,
                                           BasePermissionsRepository permissionsRepository) {
        this.librariesService = librariesService;
        this.recordServiceFactory = recordServiceFactory;
        this.permissionsRepository = permissionsRepository;
    }

    /**
     * Регистрация документа в системе.
     * <p>
     * При регистрации документа ему присваивается идентификационный номер, состоящий из 4-х частей А-Б-В-Г.
     * <p>
     * А: код территории муниципального образования в соответствии с Общероссийским классификатором территорий
     * муниципальных образований;
     * <p>
     * Б: номер раздела информационной системы;
     * <p>
     * В: календарный год размещения;
     * <p>
     * Г: порядковый номер записи в реестре;
     *
     * @return номер под которым документ был зарегистрирован.
     */
    @Override
    public String handle(RegisterDocumentRequest request) {
        ResourceQualifier rQualifier = request.getQualifier();
        LocalDateTime now = now();
        String libraryId = rQualifier.getTable();
        Long registryNumber = librariesService.incrementRegistryNumber(libraryId);
        SchemaDto schema = librariesService.getSchema(libraryId);

        IRecordsService recordsService = recordServiceFactory.get();
        IRecord record = recordsService.getById(rQualifier, rQualifier.getRecordIdAsLong());
        String oktmo = extractOktmo(record).orElseThrow(() -> new BadRequestException("Не заполнено поле oktmo."));

        String regNumber = String.format("%s-%s-%d-%d",
                                         oktmo,
                                         getLibraryNumber(libraryId),
                                         now.toLocalDate().getYear(),
                                         registryNumber);

        Map<String, Object> payload = new HashMap<>();
        payload.put("regnum", regNumber);
        payload.put("regdate", now.toLocalDate());
        payload.put("last_modified", now);

        recordsService.updateRecord(rQualifier, new RecordEntity(payload), schema);

        permissionsRepository.decreasePermissionsToViewerForAll(rQualifier);

        return regNumber;
    }

    private String getLibraryNumber(String libraryId) {
        return libraryId.replaceAll("\\D+", "");
    }

    private Optional<String> extractOktmo(IRecord record) {
        Object fiasOktmo = record.getContent().get("fias__oktmo");
        if (fiasOktmo != null) {
            return Optional.of((String) fiasOktmo);
        }

        Object oktmo = record.getContent().get("oktmo");
        if (oktmo != null) {
            return Optional.of((String) oktmo);
        }

        return Optional.empty();
    }
}
