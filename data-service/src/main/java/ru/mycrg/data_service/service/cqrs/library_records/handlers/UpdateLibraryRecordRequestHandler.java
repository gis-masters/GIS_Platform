package ru.mycrg.data_service.service.cqrs.library_records.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.service.DocumentLibraryService;
import ru.mycrg.data_service.service.cqrs.library_records.requests.UpdateLibraryRecordRequest;
import ru.mycrg.data_service.service.records.IRecordsService;
import ru.mycrg.data_service.service.records.RecordServiceFactory;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

@Component
public class UpdateLibraryRecordRequestHandler implements IRequestHandler<UpdateLibraryRecordRequest, Voidy> {

    private final DocumentLibraryService librariesService;
    private final RecordServiceFactory recordServiceFactory;

    public UpdateLibraryRecordRequestHandler(DocumentLibraryService librariesService,
                                             RecordServiceFactory recordServiceFactory) {
        this.librariesService = librariesService;
        this.recordServiceFactory = recordServiceFactory;
    }

    @Override
    public Voidy handle(UpdateLibraryRecordRequest request) {
        ResourceQualifier recordQualifier = request.getQualifier();
        IRecord newRecord = request.getNewRecord();

        IRecordsService recordsService = recordServiceFactory.get();
        IRecord currentRecordState = recordsService.getById(recordQualifier, recordQualifier.getRecordIdAsLong());
        request.setOldRecord(currentRecordState);

        SchemaDto schema = librariesService.getSchema(recordQualifier.getTable());

        recordsService.updateRecord(recordQualifier, newRecord, schema);

        return new Voidy();
    }
}
