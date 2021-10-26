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
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.security.IAuthenticationFacade;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service_contract.dto.SchemaDto;
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

    private static final Logger log = LoggerFactory.getLogger(TableService.class);

    private final TablesManager tablesManager;
    private final IMessageBusProducer messageBus;
    private final IAuthenticationFacade authenticationFacade;
    private final SchemasAndTablesRepository schemasAndTablesRepository;
    private final PermissionsService permissionsService;
    private final BasePermissionsRepository permissionsRepository;
    private final SchemaService schemaService;

    public TableService(TablesManager tablesManager,
                        IMessageBusProducer messageBus,
                        IAuthenticationFacade authenticationFacade,
                        SchemasAndTablesRepository schemasAndTablesRepository,
                        PermissionsService permissionsService,
                        BasePermissionsRepository permissionsRepository,
                        SchemaService schemaService) {
        this.messageBus = messageBus;
        this.tablesManager = tablesManager;
        this.authenticationFacade = authenticationFacade;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
        this.permissionsService = permissionsService;
        this.permissionsRepository = permissionsRepository;
        this.schemaService = schemaService;
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

            final long total = permissionsRepository.getTotalByParent(schemasAndTablesQualifier,
                                                                      dataset.pathTo(),
                                                                      title);

            return new PageImpl<>(allowedResources, pageable, total);
        }
    }

    public IResourceModel getInfo(ResourceQualifier tQualifier) {
        Optional<String> oRole = permissionsRepository.bestRole(tQualifier);
        if (oRole.isPresent()) {
            SchemasAndTables table = schemasAndTablesRepository
                    .findByIdentifier(tQualifier.getTable())
                    .orElseThrow(() -> new NotFoundException(tQualifier.getQualifier()));

            return new TableModel(table, oRole.get());
        } else {
            throw new ForbiddenException("Недостаточно прав для просмотра таблицы: " + tQualifier.getQualifier());
        }
    }

    @Transactional
    public IResourceModel create(ResourceQualifier tableIdentifier, TableCreateDto dto) {
        final String datasetId = tableIdentifier.getSchema();
        final SchemasAndTables dataset = schemasAndTablesRepository
                .findByIdentifier(datasetId)
                .orElseThrow(() -> new NotFoundException("Not found dataset: " + datasetId));

        Optional<SchemaDto> schemaByName = schemaService.getSchemaByName(dto.getSchemaId());
        if (schemaByName.isPresent()) {
            tablesManager.createTable(datasetId, dto, schemaByName.get().getProperties());

            // Add record to schemasAndTables table
            String path = dataset.getPath() + "/" + dataset.getId();
            final SchemasAndTables table = new SchemasAndTables(TABLE, dto, tableIdentifier.getTable(), path);
            table.setCrs(dto.getCrs());
            table.setSchemaId(dto.getSchemaId());

            final SchemasAndTables newEntity = schemasAndTablesRepository.save(table);

            // Create OWNER permission
            permissionsService.addOwnerPermission(schemasAndTablesQualifier, newEntity.getId());

            return new TableModel(newEntity, OWNER.name());
        } else {
            throw new BadRequestException("Schema for table doesn't exist!");
        }
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
