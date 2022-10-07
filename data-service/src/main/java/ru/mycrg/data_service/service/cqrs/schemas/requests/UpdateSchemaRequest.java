package ru.mycrg.data_service.service.cqrs.schemas.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.entity.Schema;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.dto.ResourceType.SCHEMA;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class UpdateSchemaRequest implements IRequest<Voidy>, Auditable {

    private final SchemaDto schema;

    private Schema schemaEntity;

    public UpdateSchemaRequest(SchemaDto schema) {
        this.schema = schema;
    }

    @Override
    public String getType() {
        return "UpdateSchemaRequest";
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(mapper.convertValue(schema, JsonNode.class),
                                 "UPDATE",
                                 "schemas",
                                 SCHEMA.name(),
                                 schemaEntity != null ? schemaEntity.getId() : 1L);
    }

    public SchemaDto getSchema() {
        return schema;
    }

    public Schema getSchemaEntity() {
        return schemaEntity;
    }

    public void setSchemaEntity(Schema schemaEntity) {
        this.schemaEntity = schemaEntity;
    }
}
