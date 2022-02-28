package ru.mycrg.data_service.service.cqrs.records.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.service.cqrs.files.IFilesRelation;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.service.JsonConverter.mapper;

public class DeleteLibraryRecordRequest implements IRequest<Voidy>, Auditable, IFilesRelation {

    private final ResourceQualifier rQualifier;
    private final IRecord record;
    private final String accessToken;
    private final SchemaDto schema;

    public DeleteLibraryRecordRequest(ResourceQualifier rQualifier,
                                      IRecord record,
                                      String accessToken,
                                      SchemaDto schema) {
        this.rQualifier = rQualifier;
        this.record = record;
        this.accessToken = accessToken;
        this.schema = schema;
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(accessToken,
                                 "DELETE",
                                 "unknown",
                                 "LIBRARY_RECORD",
                                 record.getId(),
                                 mapper.convertValue(record.getId(), JsonNode.class));
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
    public String getType() {
        return "DeleteLibraryRecordRequest";
    }

    public IRecord getRecord() {
        return record;
    }
}
