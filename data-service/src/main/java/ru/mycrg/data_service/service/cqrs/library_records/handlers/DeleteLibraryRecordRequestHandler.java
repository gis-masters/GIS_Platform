package ru.mycrg.data_service.service.cqrs.library_records.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.cqrs.library_records.requests.DeleteLibraryRecordRequest;
import ru.mycrg.data_service.service.document_library.RecordServiceFactory;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

@Component
public class DeleteLibraryRecordRequestHandler implements IRequestHandler<DeleteLibraryRecordRequest, Voidy> {

    private final RecordServiceFactory recordServiceFactory;

    public DeleteLibraryRecordRequestHandler(RecordServiceFactory recordServiceFactory) {
        this.recordServiceFactory = recordServiceFactory;
    }

    @Override
    public Voidy handle(DeleteLibraryRecordRequest request) {
        ResourceQualifier qualifier = request.getQualifier();

        try {
            recordServiceFactory.get().deleteRecord(qualifier, request.getSchema());
        } catch (CrgDaoException e) {
            throw new DataServiceException("Не удалось удалить упоминание о файле", e.getCause());
        }

        return new Voidy();
    }
}
