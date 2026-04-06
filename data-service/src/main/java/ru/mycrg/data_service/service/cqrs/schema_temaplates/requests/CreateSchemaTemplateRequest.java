package ru.mycrg.data_service.service.cqrs.schema_temaplates.requests;

import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.dto.ResourceType.SCHEMA;
import static ru.mycrg.http_client.JsonConverter.toJsonNode;

public class CreateSchemaTemplateRequest implements IRequest<Voidy>, Auditable {

    private final SchemaDto schema;

    public CreateSchemaTemplateRequest(SchemaDto schemaDto) {
        this.schema = schemaDto;
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(toJsonNode(schema),
                                 "CREATE",
                                 "schemas",
                                 SCHEMA.name(),
                                 1L);
    }

    @Override
    public String getType() {
        return CreateSchemaTemplateRequest.class.getSimpleName();
    }

    public SchemaDto getSchema() {
        return schema;
    }
}
