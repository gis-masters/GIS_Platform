package ru.mycrg.data_service.service.cqrs.table_records.requests;

import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import java.util.List;

import static ru.mycrg.data_service.dto.ResourceType.FEATURE;
import static ru.mycrg.http_client.JsonConverter.toJsonNode;

public class DeleteMultipleTableRecordsRequest implements IRequest<Voidy>, Auditable {

    private final ResourceQualifier rQualifiers;
    private final SchemaDto schema;
    private final List<Long> ids;

    public DeleteMultipleTableRecordsRequest(ResourceQualifier rQualifiers, SchemaDto schema, List<Long> ids) {
        this.rQualifiers = rQualifiers;
        this.schema = schema;
        this.ids = ids;
    }

    @Override
    public String getType() {
        return DeleteMultipleTableRecordsRequest.class.getSimpleName();
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent("MULTIPLE_DELETION",
                                 rQualifiers.getTable(),
                                 FEATURE.name(),
                                 toJsonNode(ids));
    }

    public ResourceQualifier getrQualifiers() {
        return rQualifiers;
    }

    public SchemaDto getSchema() {
        return schema;
    }

    public List<Long> getIds() {
        return ids;
    }
}
