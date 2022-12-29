package ru.mycrg.data_service.service.cqrs.table_records.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.dto.ResourceType.FEATURE;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class MoveRecordToNewParentRequest implements IRequest<Voidy>, Auditable {

    private final ResourceQualifier rQualifier;
    private final Long parentId;

    public MoveRecordToNewParentRequest(ResourceQualifier rQualifier,
                                        Long parentId) {
        this.parentId = parentId;
        this.rQualifier = rQualifier;
    }

    @Override
    public String getType() {
        return "MoveRecordToNewParentRequest";
    }

    @Override
    public CrgAuditEvent getEvent() {
        String entityName = "unknown";
        if (rQualifier.getTable() != null) {
            entityName = rQualifier.getTable();
        }

        return new CrgAuditEvent(mapper.convertValue(rQualifier, JsonNode.class),
                                 "MOVE",
                                 entityName,
                                 FEATURE.name(),
                                 rQualifier.getRecord());
    }

    public ResourceQualifier getRecordQualifier() {
        return rQualifier;
    }

    public Long getParentId() {
        return parentId;
    }
}
