package ru.mycrg.data_service.service.cqrs.specialization.requests;

import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

public class InitSpecializationRequest implements IRequest<Voidy> {

    private final Integer specializationId;

    public InitSpecializationRequest(Integer specializationId) {
        this.specializationId = specializationId;
    }

    @Override
    public String getType() {
        return InitSpecializationRequest.class.getSimpleName();
    }

    public Integer getSpecializationId() {
        return specializationId;
    }
}
