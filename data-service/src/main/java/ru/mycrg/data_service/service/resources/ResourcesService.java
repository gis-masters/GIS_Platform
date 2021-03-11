package ru.mycrg.data_service.service.resources;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dto.ResourceProjection;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.entity.Resource;
import ru.mycrg.data_service.repository.ResourceRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.dto.ResourceType.TABLE;

/**
 * Сервис ресурсов {@link Resource}.
 * <p>
 * Содержит методы выборки обьектов и/или их проекций {@link ResourceProjection} из базы данных.
 * <p><br />
 * Гарантирует выборку только доступных пользователю ресурсов.
 */
@Service
@Transactional
public class ResourcesService {

    private final ResourceRepository repository;
    private final ProjectionFactory projectionFactory;
    private final ResourceProtector resourceProtector;

    public ResourcesService(ResourceRepository repository,
                            ResourceProtector resourceProtector,
                            ProjectionFactory projectionFactory) {
        this.repository = repository;
        this.resourceProtector = resourceProtector;
        this.projectionFactory = projectionFactory;
    }

    /**
     * Возвращает страницу {@code Page} проекций ресура {@code ResourceProjection}, удовлетворяющих ограничению
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

    /**
     * Возвращает ресур {@link Resource} если пользователь имеет к нему доступ.
     *
     * @param rIdentifier    Класс идентефицирующий ресурс.
     * @param authentication Интерфейс описывающий пользователя.
     *
     * @return Возвращает ресур если пользователь имеет к нему доступ.
     */
    public Optional<Resource> get(@NotNull ResourceIdentifier rIdentifier, Authentication authentication) {
        final Optional<Resource> oResource = repository
                .findByTypeAndIdentifier(rIdentifier.getType().name(), rIdentifier.toString());
        if (oResource.isEmpty()) {
            return Optional.empty();
        }

        return resourceProtector.isAllowed(oResource.get(), authentication)
                ? oResource
                : Optional.empty();
    }

    /**
     * Возвращает ресурсы удовлетворяющие фильтру, а также к которым пользователь имеет доступ.
     *
     * @param title          Заглавие
     * @param type           Тип ресурса
     * @param authentication Интерфейс описывающий пользователя
     */
    public List<Resource> getByTitle(String title, ResourceType type, Authentication authentication) {
        return repository
                .findByTypeAndTitleContainingIgnoreCase(type.name(), title).stream()
                .filter(resource -> resourceProtector.isAllowed(resource, authentication))
                .collect(Collectors.toList());
    }

    /**
     * Возвращает таблицы из набора данных удовлетворяющие фильтру, а также к которым пользователь имеет доступ.
     *
     * @param datasetId      Идентификатор набора данных.
     * @param title          Заглавие.
     * @param authentication Интерфейс описывающий пользователя.
     */
    public List<Resource> getDatasetTablesFilteredByTitle(String datasetId,
                                                          String title,
                                                          Authentication authentication) {
        return repository
                .findByTypeAndIdentifierStartingWithAndTitleContainingIgnoreCase(TABLE.name(), datasetId, title)
                .stream()
                .filter(resource -> resourceProtector.isAllowed(resource, authentication))
                .collect(Collectors.toList());
    }

    public void deleteByIdentifier(String identifier) {
        repository.deleteByIdentifierStartsWith(identifier);
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
}
