package ru.mycrg.data_service.service.resources;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.BaseDao;
import ru.mycrg.data_service.dao.BasePermissionsRepository;
import ru.mycrg.data_service.dao.ddl.DdlTables;
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

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static ru.mycrg.common_utils.CrgGlobalProperties.getScratchWorkspaceName;
import static ru.mycrg.data_service.dao.config.DaoProperties.EXTENSION_POSTFIX;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.dto.Roles.OWNER;
import static ru.mycrg.data_service.service.resources.DatasetService.SCHEMAS_AND_TABLES_QUALIFIER;

@Service
public class TableService {

    private final DdlTables ddlTables;
    private final IMessageBusProducer messageBus;
    private final IAuthenticationFacade authenticationFacade;
    private final SchemasAndTablesRepository schemasAndTablesRepository;
    private final PermissionsService permissionsService;
    private final BasePermissionsRepository permissionsRepository;
    private final SchemaService schemaService;
    private final BaseDao baseDao;

    public TableService(DdlTables ddlTables,
                        IMessageBusProducer messageBus,
                        IAuthenticationFacade authenticationFacade,
                        SchemasAndTablesRepository schemasAndTablesRepository,
                        PermissionsService permissionsService,
                        BasePermissionsRepository permissionsRepository,
                        SchemaService schemaService,
                        BaseDao baseDao) {
        this.messageBus = messageBus;
        this.ddlTables = ddlTables;
        this.authenticationFacade = authenticationFacade;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
        this.permissionsService = permissionsService;
        this.permissionsRepository = permissionsRepository;
        this.schemaService = schemaService;
        this.baseDao = baseDao;
    }

    public Page<IResourceModel> getPaged(String datasetIdentifier, String ecqlFilter, Pageable pageable) {
        SchemasAndTables dataset = schemasAndTablesRepository
                .findByIdentifier(datasetIdentifier)
                .orElseThrow(() -> new NotFoundException(datasetIdentifier));

        if (authenticationFacade.isOrganizationAdmin()) {
            if (ecqlFilter == null) {
                ecqlFilter = "path = '" + dataset.pathTo() + "'";
            } else {
                ecqlFilter = ecqlFilter + " AND path = '" + dataset.pathTo() + "'";
            }

            List<TableModel> tables = baseDao.findAll(SCHEMAS_AND_TABLES_QUALIFIER,
                                                      ecqlFilter,
                                                      pageable,
                                                      TableModel.class);
            Long total = baseDao.getTotal(SCHEMAS_AND_TABLES_QUALIFIER, ecqlFilter);

            return new PageImpl<>(Collections.unmodifiableList(tables), pageable, total);
        } else {
            List<IResourceModel> allowedResources = permissionsRepository
                    .findAllowedByParent(SCHEMAS_AND_TABLES_QUALIFIER, dataset.pathTo(), ecqlFilter, pageable).stream()
                    .map(record -> new TableModel(record.getContent()))
                    .collect(Collectors.toList());

            long total = permissionsRepository.getTotalByParent(SCHEMAS_AND_TABLES_QUALIFIER,
                                                                dataset.pathTo(),
                                                                ecqlFilter);

            return new PageImpl<>(allowedResources, pageable, total);
        }
    }

    public IResourceModel getInfo(ResourceQualifier tQualifier) {
        if (authenticationFacade.isOrganizationAdmin()) {
            String ecqlFilter = "identifier = '" + tQualifier.getTable() + "'";

            TableModel table = baseDao
                    .findByFilter(SCHEMAS_AND_TABLES_QUALIFIER, ecqlFilter, TableModel.class)
                    .orElseThrow(() -> new NotFoundException("Не найдена таблица: " + tQualifier.getTable()));

            table.setRole(OWNER.name());

            return table;
        } else {
            Optional<String> oRole = permissionsRepository.bestRoleForTable(tQualifier);
            if (oRole.isPresent()) {
                SchemasAndTables table = schemasAndTablesRepository
                        .findByIdentifier(tQualifier.getTable())
                        .orElseThrow(() -> new NotFoundException(tQualifier.getQualifier()));

                return new TableModel(table, oRole.get());
            } else {
                throw new ForbiddenException("Недостаточно прав для просмотра таблицы: " + tQualifier.getQualifier());
            }
        }
    }

    @Transactional
    public IResourceModel create(ResourceQualifier tQualifier, TableCreateDto dto) {
        String datasetId = tQualifier.getSchema();
        SchemasAndTables dataset = schemasAndTablesRepository
                .findByIdentifier(datasetId)
                .orElseThrow(() -> new NotFoundException("Not found dataset: " + datasetId));

        Optional<SchemaDto> schemaByName = schemaService.getSchemaByName(dto.getSchemaId());
        if (schemaByName.isPresent()) {
            ddlTables.create(datasetId, dto, schemaByName.get().getProperties());

            // Add record to schemasAndTables table
            String path = dataset.getPath() + "/" + dataset.getId();
            SchemasAndTables table = new SchemasAndTables(TABLE, dto, tQualifier.getTable(), path);
            table.setCrs(dto.getCrs());
            table.setSchemaId(dto.getSchemaId());

            SchemasAndTables newEntity = schemasAndTablesRepository.save(table);

            // Create OWNER permission
            permissionsService.addOwnerPermission(SCHEMAS_AND_TABLES_QUALIFIER, newEntity.getId());

            return new TableModel(newEntity, OWNER.name());
        } else {
            throw new BadRequestException("Schema for table doesn't exist!");
        }
    }

    @Transactional
    public void delete(ResourceQualifier tQualifier) {
        SchemasAndTables table = schemasAndTablesRepository
                .findByIdentifier(tQualifier.getTable())
                .orElseThrow(() -> new NotFoundException(tQualifier));

        // resourceProtector.throwIfDeletionNotAllowed(targetTable, table.getId());

        schemasAndTablesRepository.deleteByIdentifier(table.getIdentifier());

        // Delete assigned rule
        permissionsService.deleteAssigned(tQualifier, table.getId());

        String extTableName = tQualifier.getTable() + EXTENSION_POSTFIX;
        ResourceQualifier extTable = new ResourceQualifier(tQualifier.getSchema(), extTableName);

        ddlTables.drop(tQualifier);
        ddlTables.drop(extTable);

        messageBus.produce(
                new LayerReferencesDeletionEvent(getScratchWorkspaceName(authenticationFacade.getOrganizationId()),
                                                 tQualifier.getSchema(),
                                                 tQualifier.getTable(),
                                                 authenticationFacade.getAccessToken()));
    }
}
