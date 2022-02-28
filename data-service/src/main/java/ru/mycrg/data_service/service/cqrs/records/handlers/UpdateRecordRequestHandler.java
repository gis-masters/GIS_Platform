package ru.mycrg.data_service.service.cqrs.records.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.service.DocumentLibraryService;
import ru.mycrg.data_service.service.SystemAttributeHandler;
import ru.mycrg.data_service.service.cqrs.records.requests.UpdateLibraryRecordRequest;
import ru.mycrg.data_service.service.records.IRecordsService;
import ru.mycrg.data_service.service.records.RecordServiceFactory;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

@Component
public class UpdateRecordRequestHandler implements IRequestHandler<UpdateLibraryRecordRequest, Voidy> {

    private final DocumentLibraryService librariesService;
    private final RecordServiceFactory recordServiceFactory;
    private final SystemAttributeHandler systemAttributeHandler;

    public UpdateRecordRequestHandler(DocumentLibraryService librariesService,
                                      RecordServiceFactory recordServiceFactory,
                                      SystemAttributeHandler systemAttributeHandler) {
        this.librariesService = librariesService;
        this.recordServiceFactory = recordServiceFactory;
        this.systemAttributeHandler = systemAttributeHandler;
    }

    @Override
    public Voidy handle(UpdateLibraryRecordRequest request) {
        ResourceQualifier recordQualifier = request.getRecordQualifier();
        IRecord newRecord = request.getNewRecord();

        IRecordsService recordsService = recordServiceFactory.get();
        IRecord currentRecordState = recordsService.getById(recordQualifier, recordQualifier.getRecord());
        request.setOldRecord(currentRecordState);

        SchemaDto schema = librariesService.getSchema(recordQualifier.getTable());
        systemAttributeHandler.initSchema(schema)
                              .updateModifiedTime(newRecord)
                              .prepareJsonb(newRecord);

        recordsService.updateRecord(recordQualifier, newRecord);

        return new Voidy();
    }
}
