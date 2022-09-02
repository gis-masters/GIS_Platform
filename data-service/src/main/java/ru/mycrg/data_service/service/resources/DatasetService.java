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

    public DatasetService(BasePermissionsRepository permissionsRepository,
                          DatasetProtector datasetProtector,
                          SchemasAndTablesRepository schemasAndTablesRepository,
                          IAuthenticationFacade authenticationFacade,
                          BaseDao baseDao) {
        this.permissionsRepository = permissionsRepository;
        this.datasetProtector = datasetProtector;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
        this.authenticationFacade = authenticationFacade;
        this.baseDao = baseDao;
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

            Long total = baseDao.getTotal(SCHEMAS_AND_TABLES_QUALIFIER, ecqlFilter);

            return new PageImpl<>(Collections.unmodifiableList(datasets), pageable, total);
        } else {
            List<IResourceModel> allowedResources = permissionsRepository
                    .findAllowedByParent(SCHEMAS_AND_TABLES_QUALIFIER, ROOT_FOLDER_PATH, ecqlFilter, null, pageable)
                    .stream()
                    .map(record -> new DatasetModel(record.getContent()))
                    .collect(Collectors.toList());

            long total = permissionsRepository
                    .getTotalByParent(SCHEMAS_AND_TABLES_QUALIFIER, ROOT_FOLDER_PATH, ecqlFilter);

            return new PageImpl<>(allowedResources, pageable, total);
        }
    }

    public IResourceModel getInfo(String datasetIdentifier) {
        ResourceQualifier dQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, datasetIdentifier);

        SchemasAndTables dataset = schemasAndTablesRepository
                .findByIdentifier(datasetIdentifier)
                .orElseThrow(() -> new NotFoundException(datasetIdentifier));

        if (datasetProtector.isOwner(dQualifier)) {
            return new DatasetModel(dataset, "OWNER");
        } else {
            Optional<String> oRole = permissionsRepository.getRoleForDataset(dQualifier);
            if (oRole.isPresent()) {
                return new DatasetModel(dataset, oRole.get());
            }

            boolean canBeViewed = permissionsRepository.isPassThroughFolder(SCHEMAS_AND_TABLES_QUALIFIER,
                                                                            dataset.getPath() + "/" + dataset.getId());
            if (canBeViewed) {
                return new DatasetModel(dataset, "VIEWER");
            } else {
                throw new ForbiddenException("Недостаточно прав для просмотра набора: " + datasetIdentifier);
            }
        }
    }
}
