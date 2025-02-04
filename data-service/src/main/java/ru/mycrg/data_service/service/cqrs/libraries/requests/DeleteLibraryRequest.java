package ru.mycrg.data_service.service.cqrs.libraries.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class DeleteLibraryRequest implements IRequest<Voidy>, Auditable {

    private final ResourceQualifier libraryQualifier;

    public DeleteLibraryRequest(ResourceQualifier libraryQualifier) {
        this.libraryQualifier = libraryQualifier;
    }

    @Override
    public String getType() {
        return DeleteLibraryRequest.class.getSimpleName();
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(mapper.convertValue(libraryQualifier, JsonNode.class),
                                 "DELETE",
                                 libraryQualifier.getQualifier(),
                                 LIBRARY.name(),
                                 libraryQualifier.getRecordIdAsLong());
    }

    public ResourceQualifier getLibraryQualifier() {
        return libraryQualifier;
    }
}
