package ru.mycrg.data_service.service.cqrs.library_records.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.BasePermissionsRepository;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.service.DocumentLibraryService;
import ru.mycrg.data_service.service.cqrs.library_records.requests.RegisterDocumentRequest;
import ru.mycrg.data_service.service.records.IRecordsService;
import ru.mycrg.data_service.service.records.RecordServiceFactory;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.mediator.IRequestHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Optional;

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
        LocalDateTime now = LocalDateTime.now();
        String libraryId = rQualifier.getTable();
        Long registryNumber = librariesService.incrementRegistryNumber(libraryId);

        IRecordsService recordsService = recordServiceFactory.get();
        IRecord record = recordsService.getById(rQualifier, rQualifier.getRecord());
        String oktmo = extractOktmo(record).orElseThrow(() -> new BadRequestException("Не заполнено поле oktmo."));

        String regNumber = String.format("%s-%s-%d-%d",
                                         oktmo,
                                         getLibraryNumber(libraryId),
                                         now.toLocalDate().getYear(),
                                         registryNumber);

        HashMap<String, Object> payload = new HashMap<>();
        payload.put("gisogd_regnum", regNumber);
        payload.put("gisogd_regdate", now.toLocalDate());
        payload.put("last_modified", now);

        recordsService.updateRecord(rQualifier, new RecordEntity(payload));

        permissionsRepository.decreasePermissionsToViewerForAll(rQualifier);

        return regNumber;
    }

    private String getLibraryNumber(String libraryId) {
        String libraryNumber = libraryId.split("dl_data_section")[1];
        if (libraryNumber != null) {
            return libraryNumber;
        }

        return "314";
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
