package ru.mycrg.data_service.service.cqrs.library_records.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.dto.record.ResponseWithReport;
import ru.mycrg.data_service.service.cqrs.library_records.requests.CreateLibraryRecordRequest;
import ru.mycrg.data_service.service.document_library.RecordServiceFactory;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequestHandler;

@Component
public class CreateLibraryRecordRequestHandler implements IRequestHandler<CreateLibraryRecordRequest, ResponseWithReport> {

    private final RecordServiceFactory recordServiceFactory;

    public CreateLibraryRecordRequestHandler(RecordServiceFactory recordServiceFactory) {
        this.recordServiceFactory = recordServiceFactory;
    }

    @Override
    public ResponseWithReport handle(CreateLibraryRecordRequest request) {
        SchemaDto schema = request.getSchema();

        IRecord record = recordServiceFactory.get()
                                             .createRecord(request.getQualifier(),
                                                           request.getRecord(),
                                                           schema);

        ResponseWithReport report = request.getResponseWithReport();
        report.setContent(record.getContent());

        return report;
    }
}
