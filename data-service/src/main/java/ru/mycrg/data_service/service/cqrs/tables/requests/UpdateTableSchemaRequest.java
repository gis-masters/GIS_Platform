package ru.mycrg.data_service.service.cqrs.tables.requests;

import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.http_client.JsonConverter.toJsonNode;

public class UpdateTableSchemaRequest implements IRequest<Voidy>, Auditable {

    private final ResourceQualifier qualifier;
    private final SchemaDto schema;

    public UpdateTableSchemaRequest(ResourceQualifier qualifier, SchemaDto schema) {
        this.qualifier = qualifier;
        this.schema = schema;
    }

    @Override
    public String getType() {
        return UpdateTableSchemaRequest.class.getSimpleName();
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(toJsonNode(schema),
                                 "UPDATE_SCHEMA",
                                 qualifier.getQualifier(),
                                 TABLE.name(),
                                 -1L);
    }

    public ResourceQualifier getQualifier() {
        return qualifier;
    }

    public SchemaDto getSchema() {
        return schema;
    }
}
