package ru.mycrg.data_service.service.cqrs.records.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.service.JsonConverter.mapper;

public class UpdateLibraryRecordRequest implements IRequest<Voidy>, Auditable {

    private final ResourceQualifier rQualifier;
    private final RecordEntity record;
    private final String accessToken;

    public UpdateLibraryRecordRequest(ResourceQualifier rQualifier, RecordEntity record, String accessToken) {
        this.rQualifier = rQualifier;
        this.record = record;
        this.accessToken = accessToken;
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(accessToken,
                                 "UPDATE",
                                 record.getTitle() == null ? "unknown" : record.getTitle(),
                                 "LIBRARY_RECORD",
                                 rQualifier.getRecord(),
                                 mapper.convertValue(record, JsonNode.class));
    }

    public ResourceQualifier getRecordQualifier() {
        return rQualifier;
    }

    public RecordEntity getRecord() {
        return record;
    }
}
