package ru.mycrg.data_service.service.cqrs.records.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.mediator.IRequest;

import static ru.mycrg.data_service.service.JsonConverter.mapper;

public class RegisterDocumentRequest implements IRequest<String>, Auditable {

    private final ResourceQualifier dQualifier;
    private final String accessToken;

    public RegisterDocumentRequest(ResourceQualifier dQualifier, String accessToken) {
        this.dQualifier = dQualifier;
        this.accessToken = accessToken;
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(accessToken,
                                 "REGISTER",
                                 "unknown",
                                 "LIBRARY_RECORD",
                                 dQualifier.getRecord(),
                                 mapper.convertValue(dQualifier, JsonNode.class));
    }

    public ResourceQualifier getQualifier() {
        return dQualifier;
    }

    @Override
    public String getType() {
        return "RegisterDocumentRequest";
    }
}
