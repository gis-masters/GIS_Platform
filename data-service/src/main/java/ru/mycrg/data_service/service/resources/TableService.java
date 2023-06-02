package ru.mycrg.data_service.service.resources;

import org.jetbrains.annotations.NotNull;
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
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.Collections.unmodifiableList;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.Roles.OWNER;
import static ru.mycrg.data_service.service.resources.DatasetService.SCHEMAS_AND_TABLES_QUALIFIER;

@Service
public class TableService {

    private final IAuthenticationFacade authenticationFacade;
    private final SchemasAndTablesRepository schemasAndTablesRepository;
    private final BasePermissionsRepository permissionsRepository;
    private final BaseDao baseDao;

    public TableService(IAuthenticationFacade authenticationFacade,
                        SchemasAndTablesRepository schemasAndTablesRepository,
                        BasePermissionsRepository permissionsRepository,
                        BaseDao baseDao) {
        this.authenticationFacade = authenticationFacade;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
        this.permissionsRepository = permissionsRepository;
        this.baseDao = baseDao;
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
}
