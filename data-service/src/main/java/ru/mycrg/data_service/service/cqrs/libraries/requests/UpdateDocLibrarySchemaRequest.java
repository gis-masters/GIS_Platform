package ru.mycrg.data_service.service.cqrs.libraries.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class UpdateDocLibrarySchemaRequest implements IRequest<Voidy>, Auditable {

    private final ResourceQualifier qualifier;
    private final SchemaDto schema;

    public UpdateDocLibrarySchemaRequest(ResourceQualifier qualifier, SchemaDto schema) {
        this.qualifier = qualifier;
        this.schema = schema;
    }

    @Override
    public String getType() {
        return UpdateDocLibrarySchemaRequest.class.getSimpleName();
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(mapper.convertValue(schema, JsonNode.class),
                                 "UPDATE_SCHEMA",
                                 qualifier.getQualifier(),
                                 LIBRARY.name(),
                                 -1L);
    }

    public ResourceQualifier getQualifier() {
        return qualifier;
    }

    public SchemaDto getSchema() {
        return schema;
    }
}
