package ru.mycrg.data_service.service.cqrs.specialization.requests;

import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

public class InitSpecializationSchemaRequest implements IRequest<Voidy> {

    private final Integer id;

    public InitSpecializationSchemaRequest(Integer id) {
        this.id = id;
    }

    @Override
    public String getType() {
        return InitSpecializationSchemaRequest.class.getSimpleName();
    }

    public Integer getId() {
        return id;
    }
}
