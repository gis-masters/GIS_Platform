package ru.mycrg.data_service.service.cqrs.schema_temaplates.requests;

import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.entity.SchemaTemplate;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.dto.ResourceType.SCHEMA;
import static ru.mycrg.http_client.JsonConverter.toJsonNode;

public class UpdateSchemaTemplateRequest implements IRequest<Voidy>, Auditable {

    private final SchemaDto schema;

    private SchemaTemplate schemaTemplateEntity;

    public UpdateSchemaTemplateRequest(SchemaDto schema) {
        this.schema = schema;
    }

    @Override
    public String getType() {
        return UpdateSchemaTemplateRequest.class.getSimpleName();
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(toJsonNode(schema),
                                 "UPDATE",
                                 "schemas",
                                 SCHEMA.name(),
                                 schemaTemplateEntity != null ? schemaTemplateEntity.getId() : 1L);
    }

    public SchemaDto getSchema() {
        return schema;
    }

    public SchemaTemplate getSchemaEntity() {
        return schemaTemplateEntity;
    }

    public void setSchemaEntity(SchemaTemplate schemaTemplateEntity) {
        this.schemaTemplateEntity = schemaTemplateEntity;
    }
}
