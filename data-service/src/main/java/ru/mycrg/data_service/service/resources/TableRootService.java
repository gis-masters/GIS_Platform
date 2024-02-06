package ru.mycrg.data_service.service.resources;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.BaseDao;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.TableModel;
import ru.mycrg.data_service.entity.SchemasAndTables;

import java.util.List;
import java.util.stream.Collectors;

import static java.util.Collections.unmodifiableList;
import static ru.mycrg.data_service.service.resources.DatasetService.SCHEMAS_AND_TABLES_QUALIFIER;

@Service
public class TableRootService {

    private final BaseDao baseDao;
    private final DatasetService datasetService;
    private final IAuthenticationFacade authenticationFacade;

    public TableRootService(IAuthenticationFacade authenticationFacade,
                            BaseDao baseDao,
                            DatasetService datasetService) {
        this.baseDao = baseDao;
        this.authenticationFacade = authenticationFacade;
        this.datasetService = datasetService;
    }

    public Page<IResourceModel> getPaged(String ecqlFilter, Pageable pageable) {
        long total;
        List<TableModel> allowedTables;
        if (authenticationFacade.isOrganizationAdmin()) {
            String excludeDatasets = excludeDatasets(ecqlFilter);
            allowedTables = baseDao.findAll(SCHEMAS_AND_TABLES_QUALIFIER,
                                            excludeDatasets,
                                            pageable,
                                            TableModel.class);
            total = baseDao.total(SCHEMAS_AND_TABLES_QUALIFIER, excludeDatasets);
        } else {
            List<String> allowedDatasets = datasetService.getAll().stream()
                                                         .map(SchemasAndTables::getIdentifier)
                                                         .collect(Collectors.toList());
            String newFilter = addDatasetsIn(ecqlFilter, allowedDatasets);
            String excludeDatasets = excludeDatasets(newFilter);

            allowedTables = baseDao.findAll(SCHEMAS_AND_TABLES_QUALIFIER,
                                            excludeDatasets,
                                            pageable,
                                            TableModel.class);
            total = baseDao.total(SCHEMAS_AND_TABLES_QUALIFIER, excludeDatasets);
        }

        return new PageImpl<>(unmodifiableList(allowedTables), pageable, total);
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
    private String addDatasetsIn(String ecqlFilter, List<String> datasets) {
        String joined = String.join(",", datasets);
        if (ecqlFilter == null) {
            ecqlFilter = "identifier IN (" + joined + ")";
        } else {
            ecqlFilter = ecqlFilter + " AND identifier IN (" + joined + ")";
        }

        return ecqlFilter;
    }
}
