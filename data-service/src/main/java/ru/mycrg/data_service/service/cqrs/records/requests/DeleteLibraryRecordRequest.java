package ru.mycrg.data_service.service.cqrs.records.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.service.JsonConverter.mapper;

public class DeleteLibraryRecordRequest implements IRequest<Voidy>, Auditable {

    private final ResourceQualifier rQualifier;
    private final Long recordId;
    private final String accessToken;

    public DeleteLibraryRecordRequest(ResourceQualifier rQualifier, Long recordId, String accessToken) {
        this.rQualifier = rQualifier;
        this.recordId = recordId;
        this.accessToken = accessToken;
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(accessToken,
                                 "DELETE",
                                 "unknown",
                                 "LIBRARY_RECORD",
                                 recordId,
                                 mapper.convertValue(recordId, JsonNode.class));
    }

    public ResourceQualifier getQualifier() {
        return rQualifier;
    }

    public Long getRecordId() {
        return recordId;
    }
}
