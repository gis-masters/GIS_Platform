package ru.mycrg.data_service.service.cqrs.libraries.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.dto.LibraryCreateDto;
import ru.mycrg.data_service.dto.LibraryModel;
import ru.mycrg.mediator.IRequest;

import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class CreateLibraryRequest implements IRequest<LibraryModel>, Auditable {

    private LibraryModel libraryModel;
    private final LibraryCreateDto libraryCreateDto;

    public CreateLibraryRequest(LibraryCreateDto libraryCreateDto) {
        this.libraryCreateDto = libraryCreateDto;
    }

    @Override
    public String getType() {
        return CreateLibraryRequest.class.getSimpleName();
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(mapper.convertValue(libraryCreateDto, JsonNode.class),
                                 "CREATE",
                                 libraryModel.getTableName() == null ? "unknown" : libraryModel.getTableName(),
                                 LIBRARY.name(),
                                 libraryModel.getId() == null ? -1 : libraryModel.getId());
    }

    public LibraryCreateDto getLibraryCreateDto() {
        return libraryCreateDto;
    }

    public void setLibraryModel(LibraryModel libraryModel) {
        this.libraryModel = libraryModel;
    }
}
