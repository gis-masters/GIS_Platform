package ru.mycrg.data_service.service.resources;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.BasePermissionsRepository;
import ru.mycrg.data_service.dao.TablesManager;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.TableCreateDto;
import ru.mycrg.data_service.dto.TableModel;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.security.IAuthenticationFacade;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service_contract.queue.request.LayerReferencesDeletionEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static ru.mycrg.common_utils.CrgGlobalProperties.getScratchWorkspaceName;
import static ru.mycrg.data_service.dao.TablesManager.EXTENSION_POSTFIX;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.dto.Roles.OWNER;

@Service
public class TableService extends SchemasAndTablesBase {

    public static final Logger log = LoggerFactory.getLogger(TableService.class);

    private final TablesManager tablesManager;
    private final IMessageBusProducer messageBus;
    private final ResourceProtector resourceProtector;
    private final IAuthenticationFacade authenticationFacade;
    private final SchemasAndTablesRepository schemasAndTablesRepository;
    private final PermissionsService permissionsService;
    private final BasePermissionsRepository permissionsRepository;

    public TableService(TablesManager tablesManager,
                        IMessageBusProducer messageBus,
                        ResourceProtector resourceProtector,
                        IAuthenticationFacade authenticationFacade,
                        SchemasAndTablesRepository schemasAndTablesRepository,
                        PermissionsService permissionsService,
                        BasePermissionsRepository permissionsRepository) {
        this.messageBus = messageBus;
        this.tablesManager = tablesManager;
        this.resourceProtector = resourceProtector;
        this.authenticationFacade = authenticationFacade;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
        this.permissionsService = permissionsService;
        this.permissionsRepository = permissionsRepository;
    }

    public Page<IResourceModel> getPaged(String datasetIdentifier, String title, Pageable pageable) {
        SchemasAndTables dataset = schemasAndTablesRepository
                .findByIdentifier(datasetIdentifier)
                .orElseThrow(() -> new NotFoundException(datasetIdentifier));

        if (permissionsRepository.isDatasetAllowed(schemasAndTablesQualifier, dataset.getId())) {
            return schemasAndTablesRepository.findByPath(dataset.pathTo(), title, pageable)
                                             .map(TableModel::new);
        } else {
            final List<IResourceModel> allowedResources = permissionsRepository
                    .findAllowedByParent(schemasAndTablesQualifier, dataset.pathTo(), title, pageable).stream()
                    .map(record -> new TableModel(record.getContent()))
                    .collect(Collectors.toList());

            final long total = permissionsRepository.getTotalByParent(schemasAndTablesQualifier, dataset.pathTo(), title);

            return new PageImpl<>(allowedResources, pageable, total);
        }
    }

    public IResourceModel getInfo(ResourceQualifier tQualifier) {
        SchemasAndTables dataset = schemasAndTablesRepository
                .findByIdentifier(tQualifier.getSchema())
                .orElseThrow(() -> new NotFoundException(tQualifier.getQualifier()));

        Optional<String> oRole = permissionsRepository.bestRole(schemasAndTablesQualifier, dataset.pathTo());
        if (oRole.isPresent()) {
            SchemasAndTables table = schemasAndTablesRepository
                    .findByIdentifier(tQualifier.getTable())
                    .orElseThrow(() -> new NotFoundException(tQualifier.getQualifier()));

            return new TableModel(table, oRole.get());
        } else {
            throw new ForbiddenException("You don't have permission to resource: " + tQualifier);
        }
    }

    @Transactional
    public IResourceModel create(ResourceQualifier tableIdentifier, TableCreateDto dto) {
        log.warn("ATTENTION. NOT CREATE REAL TABLE YET. Just write info to the resource description table");

        final String datasetId = tableIdentifier.getSchema();
        final SchemasAndTables dataset = schemasAndTablesRepository
                .findByIdentifier(datasetId)
                .orElseThrow(() -> new NotFoundException("Not found dataset: " + datasetId));

        // Add record to schemasAndTables table
        String path = dataset.getPath() + "/" + dataset.getId();
        final SchemasAndTables table = new SchemasAndTables(TABLE, dto, tableIdentifier.getTable(), path);
        table.setCrs(dto.getCrs());
        table.setSchemaId(dto.getSchemaId());

        final SchemasAndTables newEntity = schemasAndTablesRepository.save(table);

        // Create OWNER permission
        permissionsService.addOwnerPermission(schemasAndTablesQualifier, newEntity.getId());

        return new TableModel(newEntity, OWNER.name());
    }

    @Transactional
    public void delete(ResourceQualifier tableIdentifier) {
        final SchemasAndTables table = schemasAndTablesRepository
                .findByIdentifier(tableIdentifier.getTable())
                .orElseThrow(() -> new NotFoundException(tableIdentifier));

        // resourceProtector.throwIfDeletionNotAllowed(targetTable, table.getId());

        schemasAndTablesRepository.deleteByIdentifier(table.getIdentifier());

        // Delete assigned rule
        permissionsService.deleteAssigned(schemasAndTablesQualifier, table.getId());

        String extTableName = tableIdentifier.getTable() + EXTENSION_POSTFIX;
        ResourceQualifier extTable = new ResourceQualifier(tableIdentifier.getSchema(), extTableName);

        tablesManager.delete(tableIdentifier);
        tablesManager.delete(extTable);

        messageBus.produce(
                new LayerReferencesDeletionEvent(getScratchWorkspaceName(authenticationFacade.getOrganizationId()),
                                                 tableIdentifier.getSchema(),
                                                 tableIdentifier.getTable(),
                                                 authenticationFacade.getAccessToken()));
    }
}
