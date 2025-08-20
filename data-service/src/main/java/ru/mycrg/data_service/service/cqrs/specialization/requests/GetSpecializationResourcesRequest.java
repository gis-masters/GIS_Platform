package ru.mycrg.data_service.service.cqrs.specialization.requests;

import ru.mycrg.mediator.IRequest;

import java.util.Set;

public class GetSpecializationResourcesRequest implements IRequest<Set<String>> {

    private final Integer specializationId;

    public GetSpecializationResourcesRequest(Integer specializationId) {
        this.specializationId = specializationId;
    }

    @Override
    public String getType() {
        return GetSpecializationResourcesRequest.class.getSimpleName();
    }

    public Integer getSpecializationId() {
        return specializationId;
    }
}
