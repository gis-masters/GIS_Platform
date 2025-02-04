package ru.mycrg.data_service.service.cqrs.specialization.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.service.cqrs.specialization.SpecializationManager;
import ru.mycrg.data_service.service.cqrs.specialization.requests.GetSpecializationResourcesRequest;
import ru.mycrg.mediator.IRequestHandler;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class GetSpecializationResourcesRequestHandler implements IRequestHandler<GetSpecializationResourcesRequest, Set<String>> {

    private final SpecializationManager specializationManager;

    public GetSpecializationResourcesRequestHandler(SpecializationManager specializationManager) {
        this.specializationManager = specializationManager;
    }

    @Override
    public Set<String> handle(GetSpecializationResourcesRequest request) {
        return specializationManager.getFiles(request.getSpecializationId())
                                    .stream()
                                    .map(path -> path.getFileName().toString())
                                    .collect(Collectors.toSet());
    }
}
