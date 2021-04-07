package ru.mycrg.data_service.service.tables;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.TablesManager;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.Roles;
import ru.mycrg.data_service.dto.TableCreateDto;
import ru.mycrg.data_service.dto.TableModel;
import ru.mycrg.data_service.entity.Permission;
import ru.mycrg.data_service.entity.Resource;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.security.IAuthenticationFacade;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;
import ru.mycrg.data_service.service.resources.ResourceProtector;
import ru.mycrg.data_service.service.resources.ResourcesService;
import ru.mycrg.data_service_contract.queue.request.LayerReferencesDeletionEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static ru.mycrg.common_utils.CrgGlobalProperties.getScratchWorkspaceName;
import static ru.mycrg.common_utils.Paginator.getPage;
import static ru.mycrg.data_service.dao.TablesManager.EXTENSION_POSTFIX;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.dto.Roles.OWNER;
import static ru.mycrg.data_service.service.resources.ResourceIdentifier.SEPARATOR;

@Service
public class TableService implements ITableService {

    public static final Logger log = LoggerFactory.getLogger(TableService.class);

    private final IMessageBusProducer messageBus;
    private final TablesManager tablesManager;
    private final ResourcesService resourcesService;
    private final ResourceProtector resourceProtector;
    private final PermissionsService permissionsService;
    private final IAuthenticationFacade authenticationFacade;

    public TableService(ResourcesService resourcesService,
                        TablesManager tablesManager,
                        IMessageBusProducer messageBus,
                        PermissionsService permissionsService,
                        IAuthenticationFacade authenticationFacade,
                        ResourceProtector resourceProtector) {
        this.messageBus = messageBus;
        this.tablesManager = tablesManager;
        this.resourcesService = resourcesService;
        this.resourceProtector = resourceProtector;
        this.permissionsService = permissionsService;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public IResourceModel create(ResourceIdentifier rIdentifier, TableCreateDto dto) {
        log.warn("ATTENTION. NOT CREATE REAL TABLE YET. Just write info to the resource description table");

        final Optional<Resource> oResource = resourcesService.get(rIdentifier);
        if (oResource.isPresent()) {
            throw new ConflictException("Table already exist: " + rIdentifier);
        }

        // Add resource description record
        Resource entity = new Resource(TABLE, dto, rIdentifier.toString(), authenticationFacade.getLogin());
        entity.setCrs(dto.getCrs());
        entity.setSchemaId(dto.getSchemaId());

        final Resource newEntity = resourcesService.save(entity);
        resourcesService.increaseItemsCounter(rIdentifier.getParent().toString());

        return new TableModel(newEntity, OWNER);
    }

    @Override
    public Page<IResourceModel> getPaged(String datasetId,
                                         String title,
                                         Pageable pageable) {
        List<IResourceModel> tables = resourcesService
                .getDatasetTablesFilteredByTitle(datasetId, title).stream()
                .map(this::mapToModelWithDefineRole)
                .collect(Collectors.toList());

        return getPage(tables, pageable);
    }

    @Override
    public IResourceModel getByIdentifier(ResourceIdentifier rIdentifier) {
        return resourcesService.get(rIdentifier)
                               .map(this::mapToModelWithDefineRole)
                               .orElseThrow(() -> new NotFoundException(rIdentifier.toString()));
    }

    @Override
    @Transactional
    public void delete(ResourceIdentifier rIdentifier) {
        Resource resource = resourcesService.get(rIdentifier)
                                            .orElseThrow(() -> new NotFoundException(rIdentifier.toString()));
        String extTableName = rIdentifier.getId() + EXTENSION_POSTFIX;
        ResourceIdentifier extTable = new ResourceIdentifier(extTableName, TABLE, rIdentifier.getParent());

        resourcesService.delete(resource);
        tablesManager.delete(rIdentifier);
        tablesManager.delete(extTable);

        messageBus.produce(
                new LayerReferencesDeletionEvent(getScratchWorkspaceName(authenticationFacade.getOrganizationId()),
                                                 rIdentifier.getParent().getId(),
                                                 rIdentifier.getId(),
                                                 authenticationFacade.getAccessToken()));
    }

    @NotNull
    private IResourceModel mapToModelWithDefineRole(Resource resource) {
        Set<Permission> allPermissions = permissionsService.getAllRelatedPermissions(resource);
        Roles role = resourceProtector.defineRole(resource, allPermissions)
                                      .orElseThrow(() -> new ForbiddenException("Can't define role"));

        final IResourceModel resourceModel = new TableModel(resource, role);
        final String tableName = extractTableName(resourceModel.getIdentifier());
        resourceModel.setIdentifier(tableName);

        return resourceModel;
    }

    private String extractTableName(String resourceIdentifier) {
        try {
            return resourceIdentifier.split(SEPARATOR)[1];
        } catch (IndexOutOfBoundsException e) {
            return "";
        }
    }
}
