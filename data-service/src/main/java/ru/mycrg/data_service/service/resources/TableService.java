package ru.mycrg.data_service.service.resources;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.BasePermissionsRepository;
import ru.mycrg.data_service.dao.BaseReadDao;
import ru.mycrg.data_service.dao.mappers.SchemasAndTablesMapper;
import ru.mycrg.data_service.dto.TableModel;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.service.gisogd.GisogdData;
import ru.mycrg.data_service.service.schemas.SystemAttributeHandler;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import static java.util.Collections.unmodifiableList;
import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.dto.Roles.OWNER;
import static ru.mycrg.data_service.mappers.SchemaMapper.jsonToDto;
import static ru.mycrg.data_service.service.resources.DatasetService.SCHEMAS_AND_TABLES_QUALIFIER;

@Service
public class TableService {

    private final Logger log = LoggerFactory.getLogger(TableService.class);

    private final BaseReadDao baseReadDao;
    private final IAuthenticationFacade authenticationFacade;
    private final SystemAttributeHandler systemAttributeHandler;
    private final BasePermissionsRepository permissionsRepository;
    private final SchemasAndTablesRepository schemasAndTablesRepository;

    public TableService(IAuthenticationFacade authenticationFacade,
                        SchemasAndTablesRepository schemasAndTablesRepository,
                        BasePermissionsRepository permissionsRepository,
                        BaseReadDao baseReadDao,
                        SystemAttributeHandler systemAttributeHandler) {
        this.baseReadDao = baseReadDao;
        this.authenticationFacade = authenticationFacade;
        this.permissionsRepository = permissionsRepository;
        this.systemAttributeHandler = systemAttributeHandler;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
    }

    public Page<TableModel> getPaged(String datasetIdentifier, String ecqlFilter, Pageable pageable) {
        SchemasAndTables dataset = schemasAndTablesRepository
                .findByIdentifier(datasetIdentifier)
                .orElseThrow(() -> new NotFoundException(datasetIdentifier));

        long total;
        List<TableModel> allowedTables;
        if (authenticationFacade.isOrganizationAdmin()) {
            ecqlFilter = addPathToDataset(ecqlFilter, dataset.pathTo());

            allowedTables = baseReadDao.findAll(SCHEMAS_AND_TABLES_QUALIFIER,
                                                ecqlFilter,
                                                pageable,
                                                new SchemasAndTablesMapper())
                                       .stream()
                                       .map(item -> new TableModel(item, OWNER.name(), datasetIdentifier))
                                       .collect(Collectors.toList());
            total = baseReadDao.total(SCHEMAS_AND_TABLES_QUALIFIER, ecqlFilter);
        } else {
            ResourceQualifier dQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, datasetIdentifier);
            Optional<String> roleForParentDataset = permissionsRepository.getBestRoleForDataset(dQualifier);
            if (roleForParentDataset.isPresent()) {
                ecqlFilter = addPathToDataset(ecqlFilter, dataset.pathTo());

                allowedTables = baseReadDao.findAll(SCHEMAS_AND_TABLES_QUALIFIER,
                                                    ecqlFilter,
                                                    pageable,
                                                    new SchemasAndTablesMapper())
                                           .stream()
                                           .map(item -> new TableModel(item, datasetIdentifier))
                                           .collect(Collectors.toList());
                total = baseReadDao.total(SCHEMAS_AND_TABLES_QUALIFIER, ecqlFilter);
            } else {
                allowedTables = permissionsRepository
                        .findAllowedByParent(SCHEMAS_AND_TABLES_QUALIFIER, dataset.pathTo(), ecqlFilter, pageable,
                                             new SchemasAndTablesMapper())
                        .stream()
                        .map(item -> new TableModel(item, datasetIdentifier))
                        .collect(Collectors.toList());

                total = permissionsRepository.getTotalByParent(SCHEMAS_AND_TABLES_QUALIFIER,
                                                               dataset.pathTo(),
                                                               ecqlFilter);
            }
        }

        return new PageImpl<>(unmodifiableList(allowedTables), pageable, total);
    }

    public List<TableModel> getAll(SchemasAndTables dataset) {
        List<TableModel> allowedTables;
        if (authenticationFacade.isOrganizationAdmin()) {
            allowedTables = baseReadDao.findAll(SCHEMAS_AND_TABLES_QUALIFIER,
                                                addPathToDataset(dataset.pathTo()),
                                                TableModel.class);
        } else {
            ResourceQualifier dQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, dataset.getIdentifier());
            Optional<String> roleForParentDataset = permissionsRepository.getBestRoleForDataset(dQualifier);
            if (roleForParentDataset.isPresent()) {
                allowedTables = baseReadDao.findAll(SCHEMAS_AND_TABLES_QUALIFIER,
                                                    addPathToDataset(dataset.pathTo()),
                                                    TableModel.class);
            } else {
                allowedTables = permissionsRepository
                        .findAllowedByParent(SCHEMAS_AND_TABLES_QUALIFIER, dataset.pathTo())
                        .stream()
                        .map(item -> new TableModel(item, dataset.getIdentifier()))
                        .collect(Collectors.toList());
            }
        }

        return allowedTables;
    }

    public TableModel getInfo(ResourceQualifier tQualifier) {
        if (authenticationFacade.isOrganizationAdmin()) {
            SchemasAndTables table = schemasAndTablesRepository
                    .findByIdentifier(tQualifier.getTable())
                    .orElseThrow(() -> new NotFoundException("Не найдена таблица: " + tQualifier.getTable()));

            return new TableModel(table, OWNER.name(), tQualifier.getSchema());
        } else {
            Optional<String> oRole = permissionsRepository.bestRoleForTable(tQualifier);
            if (oRole.isPresent()) {
                SchemasAndTables table = schemasAndTablesRepository
                        .findByIdentifier(tQualifier.getTable())
                        .orElseThrow(() -> new NotFoundException(tQualifier.getQualifier()));

                return new TableModel(table, oRole.get(), tQualifier.getSchema());
            } else {
                throw new ForbiddenException("Недостаточно прав для просмотра таблицы: " + tQualifier.getQualifier());
            }
        }
    }

    public List<GisogdData> getTablesCreatedBySchema(String schemaId) {
        return schemasAndTablesRepository.findBySchemaId(schemaId).stream()
                                         .map(buildFullQualifier())
                                         .filter(Objects::nonNull)
                                         .collect(Collectors.toList());
    }

    public SchemaDto getSchema(ResourceQualifier qualifier) {
        return getInfo(qualifier).getSchema();
    }

    public Map<String, SchemaDto> getSchemas(List<String> tableIdentifiers) {
        return schemasAndTablesRepository
                .findByIdentifierIn(tableIdentifiers)
                .stream()
                .filter(schemasAndTables -> schemasAndTables.getSchema() != null)
                .map(schemasAndTables -> Map.entry(schemasAndTables.getIdentifier(),
                                                   jsonToDto(schemasAndTables.getSchema())))
                .filter(entry -> entry.getValue() != null)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    public String getDatasetByTableName(String tableName) {
        Optional<SchemasAndTables> table = schemasAndTablesRepository.findByIdentifier(tableName);
        if (table.isEmpty()) {
            throw new BadRequestException("Таблица " + tableName + " отсутствует в базе данных.");
        }

        String tablePath = table.get().getPath();
        if (tablePath.equals(ROOT_FOLDER_PATH)) {
            throw new BadRequestException("Данный квалификатор " + tableName + " не является табличным");
        }

        String[] parentIdSplitted = tablePath.split("/root/");
        Long parentId = Long.valueOf(parentIdSplitted[1]);

        Optional<SchemasAndTables> parentDataset = schemasAndTablesRepository.findById(parentId);
        if (parentDataset.isEmpty()) {
            throw new BadRequestException("Не существует набора данных для таблицы " + tableName);
        }

        return parentDataset.get().getIdentifier();
    }

    @NotNull
    private String addPathToDataset(String ecqlFilter, String pathTo) {
        if (ecqlFilter == null) {
            ecqlFilter = "path = '" + pathTo + "'";
        } else {
            ecqlFilter = ecqlFilter + " AND path = '" + pathTo + "'";
        }
        return ecqlFilter;
    }

    @NotNull
    private String addPathToDataset(String path) {
        return addPathToDataset(null, path);
    }

    @NotNull
    private Function<SchemasAndTables, GisogdData> buildFullQualifier() {
        return table -> {
            Optional<Long> oParentId = systemAttributeHandler.getLastIdFromPath(table.getPath());
            if (oParentId.isEmpty()) {
                return null;
            }

            Optional<SchemasAndTables> oParent = schemasAndTablesRepository.findById(oParentId.get());
            if (oParent.isEmpty()) {
                log.warn("Не найден набор данных по id: {}", oParentId.get());

                return null;
            }

            return new GisogdData(new ResourceQualifier(oParent.get().getIdentifier(), table.getIdentifier(), TABLE),
                                  table.getGisogdRfPublicationOrder());
        };
    }
}
