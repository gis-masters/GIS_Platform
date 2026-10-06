package ru.mycrg.data_service.service.cqrs.files.requests;

import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import java.util.UUID;

public class DeleteFileRequest implements IRequest<Voidy> {

    private final UUID id;

    public DeleteFileRequest(UUID id) {
        this.id = id;
    }

    public UUID getId() {
        return id;
    }

    @Override
    public String getType() {
        return DeleteFileRequest.class.getSimpleName();
    }
}
