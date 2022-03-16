package ru.mycrg.data_service.service.cqrs.library_records.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.cqrs.library_records.requests.DeleteLibraryRecordRequest;
import ru.mycrg.data_service.service.records.RecordServiceFactory;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service.service.storage.exceptions.StorageException;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

@Component
public class DeleteLibraryRecordRequestHandler implements IRequestHandler<DeleteLibraryRecordRequest, Voidy> {

    private final FileStorageService fileStorageService;
    private final RecordServiceFactory recordServiceFactory;

    public DeleteLibraryRecordRequestHandler(FileStorageService fileStorageService,
                                             RecordServiceFactory recordServiceFactory) {
        this.fileStorageService = fileStorageService;
        this.recordServiceFactory = recordServiceFactory;
    }

    @Override
    public Voidy handle(DeleteLibraryRecordRequest request) {
        ResourceQualifier rQualifier = request.getQualifier();
        IRecord record = request.getRecord();
        String innerFileName = record.getInnerPath();

        try {
            fileStorageService.deleteIfExists(innerFileName);
            recordServiceFactory.get().deleteRecord(rQualifier, record.getId());
        } catch (StorageException e) {
            throw new DataServiceException("Не удалось удалить файл: " + innerFileName, e.getCause());
        } catch (CrgDaoException e) {
            throw new DataServiceException("Не удалось удалить упоминание о файле", e.getCause());
        }

        return new Voidy();
    }
}
