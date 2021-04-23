package ru.mycrg.data_service.service.resources;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dto.*;
import ru.mycrg.data_service.entity.Resource;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.ResourceRepository;
import ru.mycrg.data_service.service.PermissionsService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.dto.Roles.OWNER;

/**
 * Сервис ресурсов {@link Resource}.
 * <p>
 * Содержит методы выборки объектов и/или их проекций {@link ResourceProjection} из базы данных.
 * <p><br />
 * Гарантирует выборку только доступных пользователю ресурсов.
 */
@Service
@Transactional
public class ResourcesService {

    private final ResourceRepository repository;
    private final ProjectionFactory projectionFactory;
    private final ResourceProtector resourceProtector;
    private final PermissionsService permissionsService;

    public ResourcesService(ResourceRepository repository,
                            ResourceProtector resourceProtector,
                            PermissionsService permissionsService,
                            ProjectionFactory projectionFactory) {
        this.repository = repository;
        this.resourceProtector = resourceProtector;
        this.projectionFactory = projectionFactory;
        this.permissionsService = permissionsService;
    }

    /**
     * Возвращает страницу {@code Page} проекций ресурса {@code ResourceProjection}, удовлетворяющих ограничению
     * разбиения на страницы, предусмотренному в объекте {@code Pageable}
     * <p>
     * Не защищена, используется только в админских целях.
     *
     * @param pageable Pagination information.
     *
     * @return A page of resources.
     */
    public Page<ResourceProjection> getPaged(Pageable pageable) {
        return repository
                .findAll(pageable)
                .map(res -> projectionFactory.createProjection(ResourceProjection.class, res));
    }

    public Optional<Resource> get(@NotNull ResourceIdentifier rIdentifier) {
        return repository.findByTypeAndIdentifier(rIdentifier.getType().name(), rIdentifier.toString());
    }

    public IResourceModel getModel(@NotNull ResourceIdentifier rIdentifier) {
        return repository.findByTypeAndIdentifier(rIdentifier.getType().name(), rIdentifier.toString())
                         .map(this::mapToResourceModel)
                         .orElseThrow(() -> new NotFoundException(rIdentifier.toString()));
    }

    /**
     * Возвращает ресурсы удовлетворяющие фильтру, а также к которым пользователь имеет доступ.
     *
     * @param title Заглавие
     * @param type  Тип ресурса
     */
    public List<IResourceModel> getByTitle(String title, ResourceType type, Pageable pageable) {
        List<IResourceModel> allowedResources = new ArrayList<>();

        repository.findByTypeAndTitleContainingIgnoreCase(type.name(), title, pageable)
                  .forEach(resource -> fillAllowedResources(allowedResources, resource));

        return allowedResources;
    }

    /**
     * Возвращает таблицы из набора данных удовлетворяющие фильтру, а также к которым пользователь имеет доступ.
     *
     * @param datasetId Идентификатор набора данных.
     * @param title     Заглавие.
     */
    public List<IResourceModel> getDatasetTablesFilteredByTitle(String datasetId, String title, Pageable pageable) {
        List<IResourceModel> allowedResources = new ArrayList<>();

        repository.findByTypeAndIdentifierStartingWithAndTitleContainingIgnoreCase(TABLE.name(),
                                                                                   datasetId + ".",
                                                                                   title,
                                                                                   pageable)
                  .forEach(resource -> fillAllowedResources(allowedResources, resource));

        return allowedResources;
    }

    public void deleteByIdentifier(String identifier) {
        repository.deleteByIdentifierStartsWith(identifier + ".");
    }

    public void delete(Resource resource) {
        repository.delete(resource);
    }

    public Resource save(Resource resource) {
        return repository.save(resource);
    }

    public void increaseItemsCounter(String parentResourceId) {
        repository.increaseItemsCounter(parentResourceId);
    }

    private void fillAllowedResources(List<IResourceModel> allowedResources, Resource resource) {
        if (resourceProtector.isAbsoluteOwner(resource)) {
            allowedResources.add(new ResourceModel(resource, OWNER));
        } else {
            Set<String> allRoles = permissionsService.getAllRelatedRoles(resource);

            resourceProtector.defineRole(allRoles)
                             .ifPresent(role -> allowedResources.add(new ResourceModel(resource, role)));
        }
    }

    @NotNull
    private ResourceModel mapToResourceModel(Resource resource) {
        if (resourceProtector.isAbsoluteOwner(resource)) {
            return new ResourceModel(resource, OWNER);
        } else {
            Set<String> allRoles = permissionsService.getAllRelatedRoles(resource);

            Roles role = resourceProtector.defineRole(allRoles)
                                          .orElseThrow(() -> new ForbiddenException(resource));

            return new ResourceModel(resource, role);
        }
    }
}
