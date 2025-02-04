package ru.mycrg.data_service.service.cqrs.library_records.requests;

import com.fasterxml.jackson.databind.JsonNode;
import org.jetbrains.annotations.Nullable;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.dto.ResourceType.FEATURE;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class MoveRecordToNewParentRequest implements IRequest<Voidy>, Auditable {

    private final ResourceQualifier recordToMoveQualifier;
    private final ResourceQualifier targetRecordQualifier;

    public MoveRecordToNewParentRequest(ResourceQualifier recordToMoveQualifier,
                                        ResourceQualifier targetRecordQualifier) {
        this.targetRecordQualifier = targetRecordQualifier;
        this.recordToMoveQualifier = recordToMoveQualifier;
    }

    @Override
    public String getType() {
        return MoveRecordToNewParentRequest.class.getSimpleName();
    }

    @Override
    public CrgAuditEvent getEvent() {
        String entityName = "unknown";
        if (recordToMoveQualifier.getTable() != null) {
            entityName = recordToMoveQualifier.getTable();
        }

        return new CrgAuditEvent(mapper.convertValue(recordToMoveQualifier, JsonNode.class),
                                 "MOVE",
                                 entityName,
                                 FEATURE.name(),
                                 recordToMoveQualifier.getRecordIdAsLong());
    }

    public ResourceQualifier getRecordToMoveQualifier() {
        return recordToMoveQualifier;
    }

    @Nullable
    public ResourceQualifier getTargetRecordQualifier() {
        return targetRecordQualifier;
    }
}
