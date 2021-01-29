package ru.mycrg.data_service.service.resources;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dto.ResourceProjection;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.entity.Resource;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.ResourceRepository;

import java.util.Optional;

import static ru.mycrg.data_service.dto.ResourceType.SCHEMA;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;

@Service
@Transactional
public class ResourcesService {

    private final ResourceRepository resRepository;
    private final ProjectionFactory projectionFactory;

    public ResourcesService(ResourceRepository resRepository,
                            ProjectionFactory projectionFactory) {
        this.resRepository = resRepository;
        this.projectionFactory = projectionFactory;
    }

    public Resource get(ResourceIdentifier resIdentifier) {
        return resRepository
                .findByTypeAndIdentifier(resIdentifier.getType().name(), resIdentifier.toString())
                .orElseThrow(() -> new NotFoundException(resIdentifier));
    }

    public Page<ResourceProjection> getPaged(Pageable pageable) {
        return resRepository
                .findAll(pageable)
                .map(res -> projectionFactory.createProjection(ResourceProjection.class, res));
    }

    public Page<Resource> getDatasetsByTitle(String title, Pageable pageable) {
        return resRepository.findByTypeAndTitleContaining(SCHEMA.name(), title, pageable);
    }

    public Page<Resource> getDatasetTablesByTitle(String dataset, String title, Pageable pageable) {
        return resRepository
                .findByTypeAndIdentifierStartingWithAndTitleContaining(TABLE.name(), dataset, title, pageable);
    }

    public Optional<Resource> getDataset(String identifier) {
        return getResourceByTypeAndId(SCHEMA, identifier);
    }

    public Optional<Resource> getTable(String identifier) {
        return getResourceByTypeAndId(TABLE, identifier);
    }

    public void deleteByIdentifier(String identifier) {
        resRepository.deleteByIdentifierStartsWith(identifier);
    }

    public void delete(Resource resource) {
        resRepository.delete(resource);
    }

    public Resource save(Resource resource) {
        return resRepository.save(resource);
    }

    public void increaseItemsCounter(String parentResourceId) {
        resRepository.increaseItemsCounter(parentResourceId);
    }

    private Optional<Resource> getResourceByTypeAndId(ResourceType type, String identifier) {
        return resRepository.findByTypeAndIdentifier(type.name(), identifier);
    }
}
