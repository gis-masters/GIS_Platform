package ru.mycrg.data_service.service.cqrs.libraries.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.dto.LibraryUpdateDto;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class UpdateLibraryRequest implements IRequest<Voidy>, Auditable {

    private final ResourceQualifier libraryQualifier;
    private final LibraryUpdateDto libraryUpdateDto;

    public UpdateLibraryRequest(ResourceQualifier libraryQualifier,
                                LibraryUpdateDto libraryUpdateDto1) {
        this.libraryQualifier = libraryQualifier;
        this.libraryUpdateDto = libraryUpdateDto1;
    }

    @Override
    public String getType() {
        return UpdateLibraryRequest.class.getSimpleName();
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent("UPDATE",
                                 libraryQualifier.getTable() == null ? "unknown" : libraryQualifier.getTable(),
                                 LIBRARY.name(),
                                 mapper.convertValue(libraryUpdateDto, JsonNode.class));
    }

    public ResourceQualifier getLibraryQualifier() {
        return libraryQualifier;
    }

    public LibraryUpdateDto getLibraryUpdateDto() {
        return libraryUpdateDto;
    }
}
