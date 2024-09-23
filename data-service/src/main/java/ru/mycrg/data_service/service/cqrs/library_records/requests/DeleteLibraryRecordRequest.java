package ru.mycrg.data_service.service.cqrs.library_records.requests;

import com.fasterxml.jackson.databind.JsonNode;
import org.jetbrains.annotations.NotNull;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.service.cqrs.files.IDeleteFilesRelation;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.dto.ResourceType.LIBRARY_RECORD;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class DeleteLibraryRecordRequest implements IRequest<Voidy>, Auditable, IDeleteFilesRelation {

    private final ResourceQualifier rQualifier;
    private final SchemaDto schema;
    private final IRecord record;

    public DeleteLibraryRecordRequest(ResourceQualifier rQualifier,
                                      IRecord record,
                                      SchemaDto schema) {
        this.rQualifier = rQualifier;
        this.record = record;
        this.schema = schema;
    }

    @Override
    public String getType() {
        return DeleteLibraryRecordRequest.class.getSimpleName();
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(mapper.convertValue(record.getId(), JsonNode.class),
                                 "DELETE",
                                 "unknown",
                                 LIBRARY_RECORD.name(),
                                 record.getId());
    }

    @Override
    public @NotNull SchemaDto getSchema() {
        return schema;
    }

    @Override
    public IRecord getRecord() {
        return record;
    }

    @Override
    public ResourceQualifier getQualifier() {
        return rQualifier;
    }
}
