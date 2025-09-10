package ru.mycrg.data_service.service.processes.geometry_importer;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.ddl.schemas.DdlSchemas;
import ru.mycrg.data_service.dto.ResourceCreateDto;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.entity.Permission;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.import_.model.DataFromGpkgPlacementModel;
import ru.mycrg.data_service.service.import_.model.FilePlacementPayloadModel;
import ru.mycrg.data_service.service.processes.IExecutor;
import ru.mycrg.data_service.service.processes.file_placement.IFilePlacer;
import ru.mycrg.data_service.service.resources.DataStoreClient;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IMasterResourceProtector;
import ru.mycrg.data_service_contract.dto.ImportReport;
import ru.mycrg.data_service_contract.dto.ProcessModel;
import ru.mycrg.data_service_contract.enums.FileType;
import ru.mycrg.data_service_contract.queue.request.GpkgStartLoaderEvent;
import ru.mycrg.http_client.HttpClient;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.http_client.handlers.BaseRequestHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.Map;

import static ru.mycrg.common_utils.CrgGlobalProperties.generateDatasetName;
import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.dto.ResourceType.DATASET;
import static ru.mycrg.data_service.service.resources.DatasetService.SCHEMAS_AND_TABLES_QUALIFIER;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

@Component
public class GpkgImporterExecutor implements IExecutor<ImportReport>, IFilePlacer {

    private final Logger log = LoggerFactory.getLogger(GpkgImporterExecutor.class);

    private final IMessageBusProducer messageBus;
    private final IAuthenticationFacade authenticationFacade;
    private final URL gisServiceUrl;
    private final HttpClient httpClient;
    private final IMasterResourceProtector resourceProtector;
    private final DdlSchemas ddlSchemas;

    private ProcessModel processModel;
    private ImportReport importReport;
    private DataFromGpkgPlacementModel dataFromGpkgPlacementModel;
    private final SchemasAndTablesRepository schemasAndTablesRepository;
    private final PermissionsService permissionsService;
    private final DataStoreClient dataStoreClient;
    private final FileRepository fileRepository;

    public GpkgImporterExecutor(IMessageBusProducer messageBus,
                                IAuthenticationFacade authenticationFacade,
                                Environment environment,
                                @Qualifier("datasetProtector") IMasterResourceProtector resourceProtector,
                                DdlSchemas ddlSchemas,
                                SchemasAndTablesRepository schemasAndTablesRepository,
                                PermissionsService permissionsService, DataStoreClient dataStoreClient,
                                FileRepository fileRepository)
            throws MalformedURLException {
        this.messageBus = messageBus;
        this.authenticationFacade = authenticationFacade;
        this.resourceProtector = resourceProtector;
        this.ddlSchemas = ddlSchemas;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
        this.permissionsService = permissionsService;
        this.dataStoreClient = dataStoreClient;
        this.fileRepository = fileRepository;

        httpClient = new HttpClient(new BaseRequestHandler(new OkHttpClient()));
        gisServiceUrl = new URL(environment.getRequiredProperty("crg-options.gis-service-url"));
    }

    @Override
    @Transactional
    public ImportReport execute() {
        log.debug("Начало публикации GPKG: {}", this.dataFromGpkgPlacementModel);
        String dataset = dataFromGpkgPlacementModel.getSourceDataset();

        dataset = createDatasetOrDoNothing(dataset);

        long orgId = authenticationFacade.getOrganizationId();
        String dbName = getDefaultDatabaseName(orgId);
        String login = authenticationFacade.getLogin();

        importReport = new ImportReport();
        importReport.setProjectId(dataFromGpkgPlacementModel.getProjectId());
        importReport.setProjectIsNew(false);
        importReport.setDatasetIdentifier(dataset);

        String filePath = dataFromGpkgPlacementModel.getFilePath();

        log.debug("Размещение GPKG файла: {}", filePath);

        messageBus.produce(new GpkgStartLoaderEvent(processModel.getId(),
                                                    dbName,
                                                    login,
                                                    authenticationFacade.getAccessToken(),
                                                    filePath,
                                                    dataFromGpkgPlacementModel.getProjectId(),
                                                    dataset));

        return importReport;
    }

    private String createDatasetOrDoNothing(String dataset) {
        if (dataset == null || dataset.isEmpty() || dataset.equals("null")) {
            //Если набор данных не передали. Создаём его сами
            String datasetName = generateDatasetName();
            ResourceQualifier dQualifier = new ResourceQualifier(datasetName);
            resourceProtector.throwIfExists(dQualifier);
            ddlSchemas.create(dQualifier);
            File file = fileRepository.findById(dataFromGpkgPlacementModel.getFileId())
                                      .orElseThrow(() -> new NotFoundException(dataFromGpkgPlacementModel.getFileId()));

            SchemasAndTables schemasAndTables = new SchemasAndTables(DATASET,
                                                                     new ResourceCreateDto(file.getTitle()),
                                                                     datasetName,
                                                                     ROOT_FOLDER_PATH);
            SchemasAndTables newEntity = schemasAndTablesRepository.save(schemasAndTables);
            Permission ownerPermission = permissionsService.addOwnerPermission(SCHEMAS_AND_TABLES_QUALIFIER,
                                                                               newEntity.getId());
            ResponseModel<Object> responseModel = dataStoreClient.create(datasetName);
            if (!responseModel.isSuccessful()) {
                schemasAndTablesRepository.delete(newEntity);
                ddlSchemas.drop(dQualifier);
                permissionsService.delete(ownerPermission);

                throw new DataServiceException("Не удалось создать хранилище на геосервере", responseModel);
            }

            dataset = datasetName;
        }
        return dataset;
    }

    @Override
    public IExecutor<ImportReport> initialize(Object data) {
        try {
            this.dataFromGpkgPlacementModel = mapper.convertValue(data,
                                                                  DataFromGpkgPlacementModel.class);
        } catch (Exception e) {
            String msg = String.format("Задана некорректная модель GPKG импорта: '%s'", data);
            log.error(msg, e.getCause());

            throw new BadRequestException(msg);
        }

        return this;
    }

    @Override
    public IExecutor<ImportReport> validate() {
        Long projectId = this.dataFromGpkgPlacementModel.getProjectId();
        if (isProjectNotAllowed(projectId)) {
            throw new BadRequestException("Проект: '" + projectId + "' не доступен для записи. Импорт GeoPackage " +
                                                  "невозможен!!!");
        }

        String dataset = this.dataFromGpkgPlacementModel.getSourceDataset();
        if (dataset != null && !dataset.isEmpty() && !dataset.equals("null")) {
            if (!resourceProtector.isEditAllowed(new ResourceQualifier(dataset))) {
                throw new BadRequestException(
                        "Не хватает прав для создания слоя в наборе данных: " + dataset + ". Импорт GPKG запрещён!!!");
            }
        }

        return this;
    }

    @Override
    public ImportReport getReport() {
        return this.importReport;
    }

    @Override
    public IExecutor<ImportReport> setPayload(ProcessModel processModel) {
        this.processModel = processModel;

        return this;
    }

    @Override
    public FilePlacementPayloadModel getPayload() {
        return null;
    }

    @Override
    public FileType getFileType() {
        return FileType.GPKG;
    }

    @Override
    public boolean notDetached() {
        return false;
    }

    // TODO: Extract to gis-service client
    private boolean isProjectNotAllowed(Long projectId) {
        try {
            Request request = new Request.Builder()
                    .addHeader("Authorization", "Bearer " + authenticationFacade.getAccessToken())
                    .url(new URL(gisServiceUrl, "/projects/" + projectId))
                    .get()
                    .build();

            ResponseModel<Map> responseModel = httpClient.handleRequest(request, Map.class);
            if (responseModel.isSuccessful()) {
                return responseModel.getBody().get("role").equals("VIEWER");
            } else {
                return true;
            }
        } catch (HttpClientException | MalformedURLException e) {
            return true;
        }
    }
}
