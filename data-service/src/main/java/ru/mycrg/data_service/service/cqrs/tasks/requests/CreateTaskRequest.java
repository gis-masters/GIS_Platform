package ru.mycrg.data_service.service.cqrs.tasks.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequest;

import static ru.mycrg.data_service.dto.ResourceType.TASK;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class CreateTaskRequest implements IRequest<IRecord>, Auditable {

    private final SchemaDto schema;
    private final RecordEntity record;
    private final ResourceQualifier qualifier;

    public CreateTaskRequest(SchemaDto schema, ResourceQualifier qualifier, RecordEntity record) {
        this.schema = schema;
        this.record = record;
        this.qualifier = qualifier;
    }

    @Override
    public String getType() {
        return CreateTaskRequest.class.getSimpleName();
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(mapper.convertValue(record, JsonNode.class),
                                 "CREATE",
                                 qualifier.getTable() == null ? "unknown" : qualifier.getTable(),
                                 TASK.name(),
                                 record.getId() == null ? -1 : record.getId());
    }

    public SchemaDto getSchema() {
        return schema;
    }

    public RecordEntity getRecord() {
        return record;
    }

    public ResourceQualifier getQualifier() {
        return qualifier;
    }
}
