package ru.mycrg.data_service.service.datasets;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.SchemasManager;
import ru.mycrg.data_service.dto.DatasetModel;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.ResourceCreateDto;
import ru.mycrg.data_service.dto.Roles;
import ru.mycrg.data_service.entity.Permission;
import ru.mycrg.data_service.entity.Resource;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.security.IAuthenticationFacade;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;
import ru.mycrg.data_service.service.resources.ResourceProtector;
import ru.mycrg.data_service.service.resources.ResourcesService;
import ru.mycrg.http_client.ResponseModel;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import static ru.mycrg.common_utils.Paginator.getPage;
import static ru.mycrg.data_service.dto.ResourceType.SCHEMA;
import static ru.mycrg.data_service.dto.Roles.OWNER;

@Service
public class DatasetService implements IDatasetService {

    public static final Logger log = LoggerFactory.getLogger(DatasetService.class);

    public static final String SCHEMA_PREFIX = "dataset";

    private final SchemasManager schemasManager;
    private final ResourceProtector resourceProtector;
    private final ResourcesService resourcesService;
    private final DataStoreClient dataStoreClient;
    private final PermissionsService permissionsService;
    private final IAuthenticationFacade authenticationFacade;

    public DatasetService(ResourcesService resourcesService,
                          ResourceProtector resourceProtector,
                          SchemasManager schemasManager,
                          PermissionsService permissionsService,
                          IAuthenticationFacade authenticationFacade,
                          DataStoreClient dataStoreClient) {
        this.schemasManager = schemasManager;
        this.dataStoreClient = dataStoreClient;
        this.resourcesService = resourcesService;
        this.resourceProtector = resourceProtector;
        this.permissionsService = permissionsService;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public Page<IResourceModel> getPaged(String title,
                                         Pageable pageable) {
        List<IResourceModel> datasets = resourcesService
                .getByTitle(title, SCHEMA).stream()
                .map(this::mapToModelWithDefineRole)
                .collect(Collectors.toList());

        return getPage(datasets, pageable);
    }

    @Override
    public IResourceModel getInfo(ResourceIdentifier rIdentifier) {
        return resourcesService.get(rIdentifier)
                               .map(this::mapToModelWithDefineRole)
                               .orElseThrow(() -> new NotFoundException(rIdentifier.toString()));
    }

    @Override
    public DatasetModel create(ResourceCreateDto dto) {
        String datasetId = String.format("%s_%s", SCHEMA_PREFIX, UUID.randomUUID().toString().substring(0, 6));

        ResourceIdentifier rIdentifier = new ResourceIdentifier(datasetId, SCHEMA);
        resourceProtector.throwIfExists(rIdentifier);

        // Create schema
        schemasManager.create(rIdentifier);

        // Add resource description record
        Resource entity = new Resource(SCHEMA, dto, rIdentifier.toString(), authenticationFacade.getLogin());
        final Resource newEntity = resourcesService.save(entity);

        ResponseModel<Object> responseModel = dataStoreClient.create(datasetId);
        if (!responseModel.isSuccessful()) {
            resourcesService.delete(newEntity);
            schemasManager.delete(rIdentifier);

            throw new DataServiceException("Не удалось создать хранилище на gis-service", responseModel);
        }

        return new DatasetModel(newEntity, OWNER);
    }

    @Override
    public void delete(ResourceIdentifier rIdentifier) {
        schemasManager.delete(rIdentifier);

        Resource dataset = resourcesService.get(rIdentifier)
                                           .orElseThrow(() -> new NotFoundException(rIdentifier.toString()));

        resourcesService.deleteByIdentifier(dataset.getIdentifier());

        ResponseModel<Object> responseModel = dataStoreClient.delete(rIdentifier.getId());
        if (!responseModel.isSuccessful()) {
            log.warn("Не удалось удалить хранилище на gis-service: {}", responseModel);
        }
    }

    @NotNull
    private IResourceModel mapToModelWithDefineRole(Resource resource) {
        Set<Permission> allPermissions = permissionsService.getAllRelatedPermissions(resource);
        Roles role = resourceProtector.defineRole(resource, allPermissions)
                                      .orElseThrow(() -> new ForbiddenException("Can't define role"));

        return new DatasetModel(resource, role);
    }
}
