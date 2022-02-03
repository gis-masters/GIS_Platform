package ru.mycrg.data_service.service.cqrs.records.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.service.cqrs.records.requests.UpdateLibraryRecordRequest;
import ru.mycrg.data_service.service.records.RecordServiceFactory;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

@Component
public class UpdateRecordRequestHandler implements IRequestHandler<UpdateLibraryRecordRequest, Voidy> {

    private final RecordServiceFactory recordServiceFactory;

    public UpdateRecordRequestHandler(RecordServiceFactory recordServiceFactory) {
        this.recordServiceFactory = recordServiceFactory;
    }

    @Override
    public Voidy handle(UpdateLibraryRecordRequest request) {
        recordServiceFactory.get()
                            .updateRecord(request.getRecordQualifier(), request.getRecord().getContent());

        return new Voidy();
    }
}
