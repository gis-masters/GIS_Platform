package ru.mycrg.data_service.service.cqrs.library_records.requests;

import com.fasterxml.jackson.databind.JsonNode;
import org.jetbrains.annotations.NotNull;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.service.cqrs.files.IUpdateFilesRelation;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.dto.ResourceType.LIBRARY_RECORD;
import static ru.mycrg.data_service.service.JsonConverter.mapper;

public class UpdateLibraryRecordRequest implements IRequest<Voidy>, Auditable, IUpdateFilesRelation {

    private final ResourceQualifier rQualifier;
    private final IRecord newRecord;
    private final SchemaDto schema;

    private IRecord oldRecord;

    public UpdateLibraryRecordRequest(SchemaDto schema,
                                      ResourceQualifier rQualifier,
                                      IRecord newRecord) {
        this.schema = schema;
        this.rQualifier = rQualifier;
        this.newRecord = newRecord;
    }

    @Override
    public String getType() {
        return "UpdateLibraryRecordRequest";
    }

    @Override
    public @NotNull SchemaDto getSchema() {
        return schema;
    }

    @Override
    public @NotNull ResourceQualifier getQualifier() {
        return rQualifier;
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(mapper.convertValue(newRecord, JsonNode.class),
                                 "UPDATE",
                                 newRecord.getTitle() == null ? "unknown" : newRecord.getTitle(),
                                 LIBRARY_RECORD.name(),
                                 rQualifier.getRecord());
    }

    @Override
    public IRecord getNewRecord() {
        return newRecord;
    }

    @Override
    public IRecord getOldRecord() {
        return oldRecord;
    }

    @Override
    public void setOldRecord(IRecord oldRecord) {
        this.oldRecord = oldRecord;
    }
}
