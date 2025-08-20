package ru.mycrg.data_service.service.cqrs.table_records.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import java.util.List;
import java.util.Map;

import static ru.mycrg.data_service.dto.ResourceType.FEATURE;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class UpdateMultipleTableRecordRequest implements IRequest<Voidy>, Auditable {

    private final ResourceQualifier qualifier;
    private final Map<String, Object> properties;
    private final SchemaDto schema;
    private final List<Long> ids;

    public UpdateMultipleTableRecordRequest(ResourceQualifier qualifier,
                                            Map<String, Object> properties,
                                            SchemaDto schema,
                                            List<Long> ids) {
        this.qualifier = qualifier;
        this.properties = properties;
        this.schema = schema;
        this.ids = ids;
    }

    @Override
    public String getType() {
        return UpdateMultipleTableRecordRequest.class.getSimpleName();
    }

    public ResourceQualifier getQualifier() {
        return qualifier;
    }

    public Map<String, Object> getProperties() {
        return properties;
    }

    public SchemaDto getSchema() {
        return schema;
    }

    public List<Long> getIds() {
        return ids;
    }

    @Override
    public CrgAuditEvent getEvent() {
        String entityName = "unknown";
        if (qualifier.getTable() != null) {
            entityName = qualifier.getTable();
        }

        return new CrgAuditEvent(mapper.convertValue(properties, JsonNode.class),
                                 "MULTIPLE_UPDATE",
                                 entityName,
                                 FEATURE.name(),
                                 mapper.convertValue(ids, JsonNode.class));
    }
}
