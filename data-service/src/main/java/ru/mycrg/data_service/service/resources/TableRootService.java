package ru.mycrg.data_service.service.resources;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.BaseReadDao;
import ru.mycrg.data_service.dao.mappers.SchemasAndTablesMapper;
import ru.mycrg.data_service.dto.TableModel;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.util.StringUtil;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import static java.util.Collections.unmodifiableList;
import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.service.resources.DatasetService.SCHEMAS_AND_TABLES_QUALIFIER;
import static ru.mycrg.data_service.util.TableUtils.getLatestParentId;

@Service
public class TableRootService {

    private final BaseReadDao baseReadDao;
    private final DatasetService datasetService;
    private final IAuthenticationFacade authenticationFacade;
    private final SchemasAndTablesRepository schemasAndTablesRepository;

    public TableRootService(IAuthenticationFacade authenticationFacade,
                            BaseReadDao baseReadDao,
                            DatasetService datasetService,
                            SchemasAndTablesRepository schemasAndTablesRepository) {
        this.baseReadDao = baseReadDao;
        this.datasetService = datasetService;
        this.authenticationFacade = authenticationFacade;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
    }

    public Page<TableModel> getPaged(String ecqlFilter, Pageable pageable) {
        long total;
        List<SchemasAndTables> allowedTables;
        if (authenticationFacade.isOrganizationAdmin()) {
            String excludeDatasets = excludeDatasets(ecqlFilter);
            allowedTables = baseReadDao.findAll(SCHEMAS_AND_TABLES_QUALIFIER,
                                                excludeDatasets,
                                                pageable,
                                                new SchemasAndTablesMapper());
            total = baseReadDao.total(SCHEMAS_AND_TABLES_QUALIFIER, excludeDatasets);
        } else {
            // TODO: Есть кейс с секьюрити, когда доступ дан непосредственно на таблицу, это расшарит все таблицы для
            //  пользователя, которые находятся в этом же наборе данных.
            List<String> allowedDatasetPaths = datasetService
                    .getAll().stream()
                    .map(dataset -> ROOT_FOLDER_PATH + "/" + dataset.getId())
                    .collect(Collectors.toList());
            if (allowedDatasetPaths.isEmpty()) {
                return new PageImpl<>(List.of(), pageable, 0);
            }

            String newFilter = addDatasetPathsIn(ecqlFilter, allowedDatasetPaths);
            allowedTables = baseReadDao.findAll(SCHEMAS_AND_TABLES_QUALIFIER,
                                                newFilter,
                                                pageable,
                                                new SchemasAndTablesMapper());
            total = baseReadDao.total(SCHEMAS_AND_TABLES_QUALIFIER, newFilter);
        }

        Set<Long> parentIds = allowedTables.stream()
                                           .map(table -> getLatestParentId(table.getPath()))
                                           .collect(Collectors.toSet());

        List<TableModel> result = new ArrayList<>();
        schemasAndTablesRepository
                .findByIdIn(parentIds)
                .forEach(dataset -> {
                    String parentPath = ROOT_FOLDER_PATH + "/" + dataset.getId();

                    allowedTables.forEach(table -> {
                        if (Objects.equals(parentPath, table.getPath())) {
                            result.add(new TableModel(table, null, dataset.getIdentifier()));
                        }
                    });
                });

        return new PageImpl<>(unmodifiableList(result), pageable, total);
    }

    private String excludeDatasets(String ecqlFilter) {
        if (ecqlFilter == null) {
            ecqlFilter = "is_folder = false";
        } else {
            ecqlFilter = ecqlFilter + " AND is_folder = false";
        }

        return ecqlFilter;
    }

    @NotNull
    private String addDatasetPathsIn(String ecqlFilter, List<String> datasets) {
        String joined = StringUtil.joinAndQuoteMark(datasets);
        if (ecqlFilter == null) {
            ecqlFilter = "path IN (" + joined + ")";
        } else {
            ecqlFilter = ecqlFilter + " AND path IN (" + joined + ")";
        }

        return ecqlFilter;
    }
}
