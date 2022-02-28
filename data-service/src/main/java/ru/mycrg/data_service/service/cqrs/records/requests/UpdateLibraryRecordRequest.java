package ru.mycrg.data_service.service.cqrs.records.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.service.cqrs.files.IFilesRelation;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.service.JsonConverter.mapper;

public class UpdateLibraryRecordRequest implements IRequest<Voidy>, Auditable, IFilesRelation {

    private final ResourceQualifier rQualifier;
    private final IRecord newRecord;
    private final String accessToken;
    private final SchemaDto schema;

    private IRecord oldRecord;

    public UpdateLibraryRecordRequest(SchemaDto schema,
                                      ResourceQualifier rQualifier,
                                      IRecord newRecord,
                                      String accessToken) {
        this.schema = schema;
        this.rQualifier = rQualifier;
        this.newRecord = newRecord;
        this.accessToken = accessToken;
    }

    @Override
    public String getType() {
        return "UpdateLibraryRecordRequest";
    }

    @Override
    public SchemaDto getSchema() {
        return schema;
    }

    @Override
    public ResourceQualifier getQualifier() {
        return rQualifier;
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(accessToken,
                                 "UPDATE",
                                 newRecord.getTitle() == null ? "unknown" : newRecord.getTitle(),
                                 "LIBRARY_RECORD",
                                 rQualifier.getRecord(),
                                 mapper.convertValue(newRecord, JsonNode.class));
    }

    public ResourceQualifier getRecordQualifier() {
        return rQualifier;
    }

    public IRecord getNewRecord() {
        return newRecord;
    }

    public IRecord getOldRecord() {
        return oldRecord;
    }

    public void setOldRecord(IRecord oldRecord) {
        this.oldRecord = oldRecord;
    }
}
