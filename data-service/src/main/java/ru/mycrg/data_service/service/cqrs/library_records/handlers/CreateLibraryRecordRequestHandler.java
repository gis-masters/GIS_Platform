package ru.mycrg.data_service.service.cqrs.library_records.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.service.cqrs.library_records.requests.CreateLibraryRecordRequest;
import ru.mycrg.data_service.service.records.RecordServiceFactory;
import ru.mycrg.mediator.IRequestHandler;

@Component
public class CreateLibraryRecordRequestHandler implements IRequestHandler<CreateLibraryRecordRequest, IRecord> {

    private final RecordServiceFactory recordServiceFactory;

    public CreateLibraryRecordRequestHandler(RecordServiceFactory recordServiceFactory) {
        this.recordServiceFactory = recordServiceFactory;
    }

    @Override
    public IRecord handle(CreateLibraryRecordRequest request) {
        return recordServiceFactory.get()
                                   .createRecord(request.getQualifier(),
                                                 request.getRecord(),
                                                 request.getFile(),
                                                 request.getSchema());
    }
}
