package ru.mycrg.data_service.service.cqrs.datasets.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.ddl.schemas.DdlSchemas;
import ru.mycrg.data_service.dto.DatasetModel;
import ru.mycrg.data_service.entity.Permission;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.cqrs.datasets.requests.CreateDatasetRequest;
import ru.mycrg.data_service.service.resources.DataStoreClient;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IResourceProtector;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.mediator.IRequestHandler;

import static ru.mycrg.common_utils.CrgGlobalProperties.generateDatasetName;
import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.dto.ResourceType.DATASET;
import static ru.mycrg.data_service.dto.Roles.OWNER;
import static ru.mycrg.data_service.service.resources.DatasetService.SCHEMAS_AND_TABLES_QUALIFIER;

@Component
public class CreateDatasetRequestHandler implements IRequestHandler<CreateDatasetRequest, DatasetModel> {

    private final Logger log = LoggerFactory.getLogger(CreateDatasetRequestHandler.class);

    private final DdlSchemas ddlSchemas;
    private final DataStoreClient dataStoreClient;
    private final IResourceProtector datasetProtector;
    private final SchemasAndTablesRepository schemasAndTablesRepository;
    private final PermissionsService permissionsService;

    public CreateDatasetRequestHandler(DdlSchemas ddlSchemas,
                                       DataStoreClient dataStoreClient,
                                       IResourceProtector datasetProtector,
                                       SchemasAndTablesRepository schemasAndTablesRepository,
                                       PermissionsService permissionsService) {
        this.ddlSchemas = ddlSchemas;
        this.dataStoreClient = dataStoreClient;
        this.datasetProtector = datasetProtector;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
        this.permissionsService = permissionsService;
    }

    @Override
    public DatasetModel handle(CreateDatasetRequest request) {
        String datasetName = generateDatasetName();

        ResourceQualifier dQualifier = new ResourceQualifier(datasetName);
        datasetProtector.throwIfExists(dQualifier);

        log.debug("Создаем набор данных с квалификатором: {} и title: {}",
                  dQualifier.getQualifier(), request.getDatasetDto().getTitle());

        // Create schema
        ddlSchemas.create(dQualifier);
        log.debug("Создана схема в БД: {}", dQualifier.getQualifier());

        // Add record to schemasAndTables table
        SchemasAndTables dataset = new SchemasAndTables(DATASET,
                                                        request.getDatasetDto(),
                                                        datasetName,
                                                        ROOT_FOLDER_PATH);
        SchemasAndTables newEntity = schemasAndTablesRepository.save(dataset);

        // Create OWNER permission
        Permission ownerPermission = permissionsService.addOwnerPermission(SCHEMAS_AND_TABLES_QUALIFIER,
                                                                           newEntity.getId());
        log.debug("Запись о наборе данных создана(schemas_and_tables), права на владение даны. ID: {}",
                  newEntity.getId());

        ResponseModel<Object> responseModel = dataStoreClient.create(datasetName);
        if (!responseModel.isSuccessful()) {
            schemasAndTablesRepository.delete(newEntity);
            ddlSchemas.drop(dQualifier);
            permissionsService.delete(ownerPermission);

            throw new DataServiceException("Не удалось создать хранилище на геосервере", responseModel);
        }

        log.debug("Хранилище: {} создано на геосервере", datasetName);

        DatasetModel datasetModel = new DatasetModel(newEntity, OWNER.name(), 0);
        request.setDatasetModel(datasetModel);

        return datasetModel;
    }
}
