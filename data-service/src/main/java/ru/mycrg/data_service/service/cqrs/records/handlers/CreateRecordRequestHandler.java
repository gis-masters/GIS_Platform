package ru.mycrg.data_service.service.cqrs.records.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.service.cqrs.records.requests.CreateLibraryRecordRequest;
import ru.mycrg.data_service.service.records.RecordServiceFactory;
import ru.mycrg.mediator.IRequestHandler;

@Component
public class CreateRecordRequestHandler implements IRequestHandler<CreateLibraryRecordRequest, IRecord> {

    private final RecordServiceFactory recordServiceFactory;

    public CreateRecordRequestHandler(RecordServiceFactory recordServiceFactory) {
        this.recordServiceFactory = recordServiceFactory;
    }

    @Override
    public IRecord handle(CreateLibraryRecordRequest request) {
        return recordServiceFactory.get()
                                   .createRecord(request.getRecordQualifier(),
                                                 request.getRecord(),
                                                 request.getFile());
    }
}
