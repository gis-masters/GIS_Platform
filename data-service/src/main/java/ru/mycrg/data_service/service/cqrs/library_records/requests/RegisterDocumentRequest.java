package ru.mycrg.data_service.service.cqrs.library_records.requests;

import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.mediator.IRequest;

import static ru.mycrg.data_service.dto.ResourceType.LIBRARY_RECORD;
import static ru.mycrg.http_client.JsonConverter.toJsonNode;

public class RegisterDocumentRequest implements IRequest<String>, Auditable {

    private final ResourceQualifier dQualifier;

    public RegisterDocumentRequest(ResourceQualifier dQualifier) {
        this.dQualifier = dQualifier;
    }

    @Override
    public String getType() {
        return RegisterDocumentRequest.class.getSimpleName();
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(toJsonNode(dQualifier),
                                 "REGISTER",
                                 dQualifier.getTable() == null ? "unknown" : dQualifier.getTable(),
                                 LIBRARY_RECORD.name(),
                                 dQualifier.getRecordIdAsLong());
    }

    public ResourceQualifier getQualifier() {
        return dQualifier;
    }
}
