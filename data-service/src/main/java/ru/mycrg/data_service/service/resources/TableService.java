package ru.mycrg.data_service.service.resources;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.BaseDao;
import ru.mycrg.data_service.dao.BasePermissionsRepository;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.TableModel;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.service.SystemAttributeHandler;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import static java.util.Collections.unmodifiableList;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.dto.Roles.OWNER;
import static ru.mycrg.data_service.service.resources.DatasetService.SCHEMAS_AND_TABLES_QUALIFIER;

@Service
public class TableService {

    private final Logger log = LoggerFactory.getLogger(TableService.class);

    private final BaseDao baseDao;
    private final IAuthenticationFacade authenticationFacade;
    private final SystemAttributeHandler systemAttributeHandler;
    private final BasePermissionsRepository permissionsRepository;
    private final SchemasAndTablesRepository schemasAndTablesRepository;

    public TableService(IAuthenticationFacade authenticationFacade,
                        SchemasAndTablesRepository schemasAndTablesRepository,
                        BasePermissionsRepository permissionsRepository,
                        BaseDao baseDao,
                        SystemAttributeHandler systemAttributeHandler) {
        this.authenticationFacade = authenticationFacade;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
        this.permissionsRepository = permissionsRepository;
        this.baseDao = baseDao;
        this.systemAttributeHandler = systemAttributeHandler;
    }

    public List<ResourceQualifier> getTablesCreatedBySchema(String schemaId) {
        return schemasAndTablesRepository.findBySchemaId(schemaId).stream()
                                         .map(buildFullQualifier())
                                         .filter(Objects::nonNull)
                                         .collect(Collectors.toList());
    }

    public Page<IResourceModel> getPaged(String datasetIdentifier, String ecqlFilter, Pageable pageable) {
        SchemasAndTables dataset = schemasAndTablesRepository
                .findByIdentifier(datasetIdentifier)
                .orElseThrow(() -> new NotFoundException(datasetIdentifier));

        long total;
        List<TableModel> allowedTables;
        if (authenticationFacade.isOrganizationAdmin()) {
            ecqlFilter = addPathToDataset(ecqlFilter, dataset.pathTo());

            allowedTables = baseDao.findAll(SCHEMAS_AND_TABLES_QUALIFIER,
                                            ecqlFilter,
                                            pageable,
                                            TableModel.class);
            total = baseDao.getTotal(SCHEMAS_AND_TABLES_QUALIFIER, ecqlFilter);
        } else {
            ResourceQualifier dQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, datasetIdentifier);
            Optional<String> roleForParentDataset = permissionsRepository.getBestRoleForDataset(dQualifier);
            if (roleForParentDataset.isPresent()) {
                ecqlFilter = addPathToDataset(ecqlFilter, dataset.pathTo());

                allowedTables = baseDao.findAll(SCHEMAS_AND_TABLES_QUALIFIER,
                                                ecqlFilter,
                                                pageable,
                                                TableModel.class);
                total = baseDao.getTotal(SCHEMAS_AND_TABLES_QUALIFIER, ecqlFilter);
            } else {
                allowedTables = permissionsRepository
                        .findAllowedByParent(SCHEMAS_AND_TABLES_QUALIFIER, dataset.pathTo(), ecqlFilter, null, pageable)
                        .stream()
                        .map(record -> new TableModel(record.getContent()))
                        .collect(Collectors.toList());

                total = permissionsRepository.getTotalByParent(SCHEMAS_AND_TABLES_QUALIFIER,
                                                               dataset.pathTo(),
                                                               ecqlFilter);
            }
        }

        return new PageImpl<>(unmodifiableList(allowedTables), pageable, total);
    }

    public Long getAllowedTablesCount(String datasetId) {
        Page<IResourceModel> page = getPaged(datasetId, null, PageRequest.of(0, 1));

        return page.getTotalElements();
    }

    public String getDatasetByTableName(String tableName) {
        Optional<SchemasAndTables> table = schemasAndTablesRepository.findByIdentifier(tableName);
        if (table.isEmpty()) {
            throw new BadRequestException("Таблица " + tableName + " отсутствует в базе данных.");
        }

        String tablePath = table.get().getPath();
        if (tablePath.equals("/root")) {
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

    public String getTableCrs(String identifier) {
        return schemasAndTablesRepository
                .findCrsByIdentifier(identifier)
                .orElseThrow(() -> new NotFoundException("Не задан crs для таблицы: " + identifier));
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
    private Function<SchemasAndTables, ResourceQualifier> buildFullQualifier() {
        return table -> {
            Optional<Long> oParentId = systemAttributeHandler.getLastIdFromPath(table.getPath());
            if (oParentId.isPresent()) {
                Long parentId = oParentId.get();

                Optional<SchemasAndTables> parent = schemasAndTablesRepository.findById(parentId);
                if (parent.isEmpty()) {
                    log.warn("Не найден набор данных по id: " + parentId);
                } else {
                    return null;
                }

                return new ResourceQualifier("", table.getIdentifier(), TABLE);
            }

            return null;
        };
    }
}
