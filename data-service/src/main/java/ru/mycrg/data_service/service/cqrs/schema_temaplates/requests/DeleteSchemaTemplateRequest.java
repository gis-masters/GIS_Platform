package ru.mycrg.data_service.service.cqrs.schema_temaplates.requests;

import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.dto.ResourceType.SCHEMA;

public class DeleteSchemaTemplateRequest implements IRequest<Voidy>, Auditable {

    private final String schemaTemplateName;

    public DeleteSchemaTemplateRequest(String schemaTemplateName) {
        this.schemaTemplateName = schemaTemplateName;
    }

    @Override
    public String getType() {
        return DeleteSchemaTemplateRequest.class.getSimpleName();
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(schemaTemplateName,
                                 "DELETE",
                                 "schemas",
                                 SCHEMA.name());
    }

    public String getSchemaTemplateName() {
        return schemaTemplateName;
    }
}
