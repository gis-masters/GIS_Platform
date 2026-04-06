package ru.mycrg.data_service.service.cqrs.tables.requests;

import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.http_client.JsonConverter.toJsonNode;

public class DeleteTableRequest implements IRequest<Voidy>, Auditable {

    private ResourceQualifier tQualifier;

    public DeleteTableRequest(ResourceQualifier tQualifier) {
        this.tQualifier = tQualifier;
    }

    @Override
    public String getType() {
        return DeleteTableRequest.class.getSimpleName();
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(toJsonNode(tQualifier),
                                 "DELETE",
                                 tQualifier.getTable(),
                                 TABLE.name(),
                                 tQualifier.getRecordIdAsLong());
    }

    public ResourceQualifier gettQualifier() {
        return tQualifier;
    }

    public void settQualifier(ResourceQualifier tQualifier) {
        this.tQualifier = tQualifier;
    }
}
