package ru.mycrg.data_service.service.records;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.BasePermissionsRepository;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.service.DocumentLibraryService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class DocumentRegistrar implements IDocumentRegistrar {

    private final DocumentLibraryService librariesService;
    private final RecordServiceFactory recordServiceFactory;
    private final BasePermissionsRepository permissionsRepository;

    public DocumentRegistrar(DocumentLibraryService librariesService,
                             RecordServiceFactory recordServiceFactory,
                             BasePermissionsRepository permissionsRepository) {
        this.librariesService = librariesService;
        this.recordServiceFactory = recordServiceFactory;
        this.permissionsRepository = permissionsRepository;
    }

    @Transactional
    public String register(ResourceQualifier rQualifier) {
        LocalDateTime now = LocalDateTime.now();
        String libraryId = rQualifier.getTable();
        Long registryNumber = librariesService.incrementRegistryNumber(libraryId);

        IRecordsService recordsService = recordServiceFactory.get();
        Map<String, Object> record = recordsService.getById(rQualifier, rQualifier.getRecord());
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

        recordsService.updateRecord(rQualifier, payload);

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

    private Optional<String> extractOktmo(Map<String, Object> record) {
        Object fiasOktmo = record.get("fias__oktmo");
        if (fiasOktmo != null) {
            return Optional.of((String) fiasOktmo);
        }

        Object oktmo = record.get("oktmo");
        if (oktmo != null) {
            return Optional.of((String) oktmo);
        }

        return Optional.empty();
    }
}
