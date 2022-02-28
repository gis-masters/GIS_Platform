package ru.mycrg.data_service.service.resources;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.BaseDao;
import ru.mycrg.data_service.dao.BasePermissionsRepository;
import ru.mycrg.data_service.dao.ddl.DdlSchemas;
import ru.mycrg.data_service.dto.DatasetModel;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.ResourceCreateDto;
import ru.mycrg.data_service.entity.Permission;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.security.IAuthenticationFacade;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.resources.protectors.DatasetProtector;
import ru.mycrg.data_service.service.resources.protectors.IResourceProtector;
import ru.mycrg.http_client.ResponseModel;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static ru.mycrg.common_utils.CrgGlobalProperties.generateDatasetName;
import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.DATASET;
import static ru.mycrg.data_service.dto.Roles.OWNER;

@Service
public class DatasetService {

    public static final ResourceQualifier SCHEMAS_AND_TABLES_QUALIFIER =
            new ResourceQualifier(SYSTEM_SCHEMA_NAME, "schemas_and_tables");

    private static final Logger log = LoggerFactory.getLogger(DatasetService.class);

    private final BasePermissionsRepository permissionsRepository;
    private final DdlSchemas ddlSchemas;
    private final DataStoreClient dataStoreClient;
    private final IResourceProtector datasetProtector;
    private final SchemasAndTablesRepository schemasAndTablesRepository;
    private final PermissionsService permissionsService;
    private final IAuthenticationFacade authenticationFacade;
    private final BaseDao baseDao;

    public DatasetService(BasePermissionsRepository permissionsRepository,
                          DatasetProtector datasetProtector,
                          DdlSchemas ddlSchemas,
                          DataStoreClient dataStoreClient,
                          SchemasAndTablesRepository schemasAndTablesRepository,
                          PermissionsService permissionsService,
                          IAuthenticationFacade authenticationFacade,
                          BaseDao baseDao) {
        this.permissionsRepository = permissionsRepository;
        this.ddlSchemas = ddlSchemas;
        this.dataStoreClient = dataStoreClient;
        this.datasetProtector = datasetProtector;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
        this.permissionsService = permissionsService;
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

    public DatasetModel create(ResourceCreateDto dto) {
        String datasetName = generateDatasetName();

        ResourceQualifier dQualifier = new ResourceQualifier(datasetName);
        datasetProtector.throwIfExists(dQualifier);

        // Create schema
        ddlSchemas.create(dQualifier);

        // Add record to schemasAndTables table
        SchemasAndTables dataset = new SchemasAndTables(DATASET, dto, datasetName, ROOT_FOLDER_PATH);
        SchemasAndTables newEntity = schemasAndTablesRepository.save(dataset);

        // Create OWNER permission
        Permission ownerPermission = permissionsService.addOwnerPermission(SCHEMAS_AND_TABLES_QUALIFIER,
                                                                           newEntity.getId());

        ResponseModel<Object> responseModel = dataStoreClient.create(datasetName);
        if (!responseModel.isSuccessful()) {
            schemasAndTablesRepository.delete(newEntity);
            ddlSchemas.drop(dQualifier);
            permissionsService.delete(ownerPermission);

            throw new DataServiceException("Не удалось создать хранилище на gis-service", responseModel);
        }

        return new DatasetModel(newEntity, OWNER.name());
    }

    @Transactional
    public void delete(ResourceQualifier datasetQualifier) {
        SchemasAndTables dataset = schemasAndTablesRepository
                .findByIdentifier(datasetQualifier.toString())
                .orElseThrow(() -> new NotFoundException(datasetQualifier));

        if (!datasetProtector.isOwner(datasetQualifier)) {
            throw new ForbiddenException("Недостаточно прав для удаления набора: " + datasetQualifier.getQualifier());
        }

        // Delete from DB
        ddlSchemas.drop(datasetQualifier);

        // Delete from information table
        schemasAndTablesRepository.deleteByIdentifier(datasetQualifier.toString());

        // Delete from geoserver
        ResponseModel<Object> responseModel = dataStoreClient.delete(datasetQualifier.toString());
        if (!responseModel.isSuccessful()) {
            log.warn("Не удалось удалить хранилище на gis-service: {}", responseModel);
        }

        // Delete assigned rule
        permissionsService.deleteAssigned(datasetQualifier, dataset.getId());
    }
}
