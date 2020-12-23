package ru.mycrg.data_service.service.resources;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dto.ResourceProjection;
import ru.mycrg.data_service.entity.Resource;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.ResourceRepository;

@Service
public class ResourcesService {

    private final ResourceRepository resRepository;
    private final ProjectionFactory projectionFactory;

    public ResourcesService(ResourceRepository resRepository,
                            ProjectionFactory projectionFactory) {
        this.resRepository = resRepository;
        this.projectionFactory = projectionFactory;
    }

    @NotNull
    public Resource get(ResourceIdentifier resIdentifier) {
        return resRepository.findByTypeAndIdentifier(resIdentifier.getType().name(), resIdentifier.toString())
                            .orElseThrow(() -> new NotFoundException(resIdentifier.toString()));
    }

    public Page<ResourceProjection> getPaged(Pageable pageable) {
        return resRepository
                .findAll(pageable)
                .map(res -> projectionFactory.createProjection(ResourceProjection.class, res));
    }
}
