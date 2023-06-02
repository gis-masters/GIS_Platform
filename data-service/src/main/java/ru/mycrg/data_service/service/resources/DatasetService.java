package ru.mycrg.data_service.service.resources;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.BaseDao;
import ru.mycrg.data_service.dao.BasePermissionsRepository;
import ru.mycrg.data_service.dto.DatasetModel;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.service.resources.protectors.DatasetProtector;
import ru.mycrg.data_service.service.resources.protectors.IResourceProtector;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;

@Service
public class DatasetService {

    public static final ResourceQualifier SCHEMAS_AND_TABLES_QUALIFIER =
            new ResourceQualifier(SYSTEM_SCHEMA_NAME, "schemas_and_tables");

    private final BasePermissionsRepository permissionsRepository;
    private final IResourceProtector datasetProtector;
    private final SchemasAndTablesRepository schemasAndTablesRepository;
    private final IAuthenticationFacade authenticationFacade;
    private final BaseDao baseDao;
    private final TableService tableService;

    public DatasetService(BasePermissionsRepository permissionsRepository,
                          DatasetProtector datasetProtector,
                          SchemasAndTablesRepository schemasAndTablesRepository,
                          IAuthenticationFacade authenticationFacade,
                          BaseDao baseDao,
                          TableService tableService) {
        this.permissionsRepository = permissionsRepository;
        this.datasetProtector = datasetProtector;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
        this.authenticationFacade = authenticationFacade;
        this.baseDao = baseDao;
        this.tableService = tableService;
    }

    public Page<IResourceModel> getPaged(String ecqlFilter, Pageable pageable) {
        if (authenticationFacade.isOrganizationAdmin()) {
            if (ecqlFilter == null) {
                ecqlFilter = "is_folder = true";
            } else {
                ecqlFilter = ecqlFilter + " AND is_folder = true";
            }

            List<DatasetModel> datasets = baseDao.findAll(SCHEMAS_AND_TABLES_QUALIFIER,
                                                          ecqlFilter,
                                                          pageable,
                                                          DatasetModel.class);
            List<IResourceModel> datasetsWithItemsCount = datasets
                    .stream()
                    .map(datasetModel -> getInfo(datasetModel.getIdentifier()))
                    .collect(Collectors.toList());

            Long total = baseDao.getTotal(SCHEMAS_AND_TABLES_QUALIFIER, ecqlFilter);

            return new PageImpl<>(Collections.unmodifiableList(datasetsWithItemsCount), pageable, total);
        } else {
            List<IResourceModel> allowedResources = permissionsRepository
                    .findAllowedByParent(SCHEMAS_AND_TABLES_QUALIFIER, ROOT_FOLDER_PATH, ecqlFilter, null, pageable)
                    .stream()
                    .map(record -> new DatasetModel(record.getContent()))
                    .collect(Collectors.toList());

            List<IResourceModel> datasetsWithItemsCount = allowedResources
                    .stream()
                    .map(datasetModel -> getInfo(datasetModel.getIdentifier()))
                    .collect(Collectors.toList());

            long total = permissionsRepository
                    .getTotalByParent(SCHEMAS_AND_TABLES_QUALIFIER, ROOT_FOLDER_PATH, ecqlFilter);

            return new PageImpl<>(datasetsWithItemsCount, pageable, total);
        }
    }

    public IResourceModel getInfo(String datasetIdentifier) {
        ResourceQualifier dQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, datasetIdentifier);

        Integer allowedTablesCount = tableService.getAllowedTablesCount(datasetIdentifier).intValue();

        SchemasAndTables dataset = schemasAndTablesRepository
                .findByIdentifier(datasetIdentifier)
                .orElseThrow(() -> new NotFoundException(datasetIdentifier));

        if (datasetProtector.isOwner(dQualifier)) {
            return new DatasetModel(dataset, "OWNER", allowedTablesCount);
        } else {
            Optional<String> oRole = permissionsRepository.getBestRoleForDataset(dQualifier);
            if (oRole.isPresent()) {
                return new DatasetModel(dataset, oRole.get(), allowedTablesCount);
            }

            boolean canBeViewed = permissionsRepository.isPassThroughFolder(SCHEMAS_AND_TABLES_QUALIFIER,
                                                                            dataset.getPath() + "/" + dataset.getId());
            if (canBeViewed) {
                return new DatasetModel(dataset, "VIEWER", allowedTablesCount);
            } else {
                throw new ForbiddenException("Недостаточно прав для просмотра набора: " + datasetIdentifier);
            }
        }
    }
}
