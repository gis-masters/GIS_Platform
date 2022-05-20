package ru.mycrg.data_service.service.cqrs.schemas.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.dto.ResourceType.SCHEMA;
import static ru.mycrg.data_service.service.JsonConverter.mapper;

public class CreateSchemaRequest implements IRequest<Voidy>, Auditable {

    private final SchemaDto schema;

    public CreateSchemaRequest(SchemaDto schemaDto) {
        this.schema = schemaDto;
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(mapper.convertValue(schema, JsonNode.class),
                                 "CREATE",
                                 "schemas",
                                 SCHEMA.name(),
                                 1L);
    }

    @Override
    public String getType() {
        return "CreateSchemaRequest";
    }

    public SchemaDto getSchema() {
        return schema;
    }
}
