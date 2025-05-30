package ru.mycrg.data_service.service.cqrs.library_records.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.dto.ResourceType.LIBRARY_RECORD;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class RecoverLibraryRecordRequest implements IRequest<Voidy>, Auditable {

    private final ResourceQualifier rQualifier;
    private final Long parentFolderId;

    public RecoverLibraryRecordRequest(ResourceQualifier rQualifier, Long parentFolderId) {
        this.rQualifier = rQualifier;
        this.parentFolderId = parentFolderId;
    }

    @Override
    public String getType() {
        return RecoverLibraryRecordRequest.class.getSimpleName();
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(mapper.convertValue(rQualifier.getRecordId(), JsonNode.class),
                                 "RECOVER",
                                 rQualifier.getTable() == null ? "unknown" : rQualifier.getTable(),
                                 LIBRARY_RECORD.name(),
                                 rQualifier.getRecordIdAsLong());
    }

    public ResourceQualifier getQualifier() {
        return rQualifier;
    }

    public Long getParentFolderId() {
        return parentFolderId;
    }
}
