package ru.mycrg.data_service.service.cqrs.tasks.requests;

import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

public class CreateTaskTableRequest implements IRequest<Voidy> {

    private final String schemaId;

    public CreateTaskTableRequest(String schemaId) {
        this.schemaId = schemaId;
    }

    @Override
    public String getType() {
        return CreateTaskTableRequest.class.getSimpleName();
    }

    public String getSchemaId() {
        return schemaId;
    }
}
