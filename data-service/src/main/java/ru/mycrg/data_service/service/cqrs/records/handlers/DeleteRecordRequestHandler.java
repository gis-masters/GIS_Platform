package ru.mycrg.data_service.service.cqrs.records.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.cqrs.records.requests.DeleteLibraryRecordRequest;
import ru.mycrg.data_service.service.records.RecordServiceFactory;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service.service.storage.exceptions.StorageException;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import java.util.Map;

import static ru.mycrg.data_service.util.SystemLibraryAttributes.INNER_PATH;

@Component
public class DeleteRecordRequestHandler implements IRequestHandler<DeleteLibraryRecordRequest, Voidy> {

    private final FileStorageService fileStorageService;
    private final RecordServiceFactory recordServiceFactory;

    public DeleteRecordRequestHandler(FileStorageService fileStorageService,
                                      RecordServiceFactory recordServiceFactory) {
        this.fileStorageService = fileStorageService;
        this.recordServiceFactory = recordServiceFactory;
    }

    @Override
    public Voidy handle(DeleteLibraryRecordRequest request) {
        ResourceQualifier lQualifier = request.getQualifier();
        Long recId = request.getRecordId();

        Map<String, Object> record = recordServiceFactory.get().getById(lQualifier, recId);
        String innerFileName = (String) record.get(INNER_PATH.getName());
        try {
            fileStorageService.deleteIfExists(innerFileName);
            recordServiceFactory.get().deleteRecord(lQualifier, recId);
        } catch (StorageException e) {
            throw new DataServiceException("Не удалось удалить файл: " + innerFileName, e.getCause());
        } catch (CrgDaoException e) {
            throw new DataServiceException("Не удалось удалить упоминание о файле", e.getCause());
        }

        return new Voidy();
    }
}
