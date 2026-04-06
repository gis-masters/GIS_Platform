package ru.mycrg.data_service.service.processes.geometry_importer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.common_contracts.generated.data_service.gpkg.DataFromGpkgPlacementModel;
import ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgLayersPlacementModel;
import ru.mycrg.common_contracts.generated.data_service.gpkg.contents.GpkgContentsBaseDto;
import ru.mycrg.common_contracts.generated.data_service.gpkg.contents.GpkgContentsFeatures;
import ru.mycrg.common_contracts.generated.data_service.gpkg.contents.GpkgContentsTiles;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgPayloadData;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessReport;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgTile;
import ru.mycrg.data_service.dao.ddl.schemas.DdlSchemas;
import ru.mycrg.data_service.dto.ResourceCreateDto;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.entity.Permission;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.cqrs.datasets.handlers.CreateDatasetRequestHandler;
import ru.mycrg.data_service.service.gpkg.importer.GpkgReaderService;
import ru.mycrg.data_service.service.import_.model.FilePlacementPayloadModel;
import ru.mycrg.data_service.service.processes.IExecutor;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service.service.processes.file_placement.IFilePlacer;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.DocLibraryRecordsProtector;
import ru.mycrg.data_service.service.resources.protectors.IMasterResourceProtector;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service_contract.dto.ProcessModel;
import ru.mycrg.data_service_contract.enums.FileType;
import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.sql.Connection;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus.ACTIVE;
import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus.ERROR;
import static ru.mycrg.common_utils.CrgGlobalProperties.generateDatasetName;
import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.DATASET;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;
import static ru.mycrg.data_service.service.resources.DatasetService.SCHEMAS_AND_TABLES_QUALIFIER;
import static ru.mycrg.data_service_contract.enums.FileType.GPKG;
import static ru.mycrg.http_client.JsonConverter.*;

@Component
public class GpkgImporterExecutor implements IExecutor<GpkgProcessReport>, IFilePlacer {

    private final Logger log = LoggerFactory.getLogger(GpkgImporterExecutor.class);

    private final IMessageBusProducer messageBus;
    private final IAuthenticationFacade authenticationFacade;
    private final FileRepository fileRepository;
    private final GpkgReaderService gpkgReaderService;
    private final DdlSchemas ddlSchemas;
    private final SchemasAndTablesRepository schemasAndTablesRepository;
    private final PermissionsService permissionsService;
    private final CreateDatasetRequestHandler createDatasetRequestHandler;
    private final FileStorageService fileStorage;
    private final ProcessService processService;
    private final IMasterResourceProtector resourceProtector;

    private ProcessModel processModel;
    private DataFromGpkgPlacementModel dataFromGpkgPlacementModel;
    private GpkgProcessReport importReport;

    public GpkgImporterExecutor(IMessageBusProducer messageBus,
                                IAuthenticationFacade authenticationFacade,
                                FileRepository fileRepository,
                                GpkgReaderService gpkgReaderService,
                                DdlSchemas ddlSchemas,
                                SchemasAndTablesRepository schemasAndTablesRepository,
                                PermissionsService permissionsService,
                                CreateDatasetRequestHandler createDatasetRequestHandler,
                                FileStorageService fileStorage,
                                ProcessService processService,
                                DocLibraryRecordsProtector resourceProtector) {
        this.messageBus = messageBus;
        this.authenticationFacade = authenticationFacade;
        this.fileRepository = fileRepository;
        this.gpkgReaderService = gpkgReaderService;
        this.ddlSchemas = ddlSchemas;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
        this.permissionsService = permissionsService;
        this.createDatasetRequestHandler = createDatasetRequestHandler;
        this.fileStorage = fileStorage;
        this.processService = processService;
        this.resourceProtector = resourceProtector;
    }

    @Override
    @Transactional
    public GpkgProcessReport execute() {
        String title = importReport.getFileTitle();

        String msg = "Процесс импорта GPKG '" + title + "' в проект запущен.";
        importReport.getMessages().add(msg);

        log.debug(msg);

        long orgId = authenticationFacade.getOrganizationId();

        processService.updateProcessTitle(processModel.getId(), getDefaultDatabaseName(orgId), "Импорт GPKG " + title);

        Optional<String> datasetName;
        try {
            datasetName = createDataset(title);
        } catch (Exception e) {
            msg = "Ошибка создания набора данных для результирующих данных. Причина: " + e.getMessage();
            log.debug(msg);
            this.importReport.setStatus(ERROR);
            this.importReport.getMessages().add(msg);
            processService.updateProcess(processModel.getId(),
                                         ProcessStatus.ERROR,
                                         getDefaultDatabaseName(orgId),
                                         toJsonNode(importReport));

            throw new BadRequestException(msg);
        }

        if (datasetName.isEmpty()) {
            msg = "Ошибка создания набора данных для результирующих данных. Набор данных не был создан корректно.";
            log.debug(msg);
            this.importReport.setStatus(ERROR);
            this.importReport.getMessages().add(msg);
            processService.updateProcess(processModel.getId(),
                                         ProcessStatus.ERROR,
                                         getDefaultDatabaseName(orgId),
                                         toJsonNode(importReport));

            throw new BadRequestException(msg);
        }

        messageBus.produce(new ImportGpkgEvent(processModel.getId(),
                                               getDefaultDatabaseName(orgId),
                                               authenticationFacade.getAccessToken(),
                                               authenticationFacade.getLogin(),
                                               importReport.getFileId(),
                                               dataFromGpkgPlacementModel.getProjectId(),
                                               datasetName.get(),
                                               title,
                                               importReport));

        return importReport;
    }

    @Override
    public FileType getFileType() {
        return GPKG;
    }

    @Override
    public IExecutor<GpkgProcessReport> initialize(Object data) {
        try {
            this.dataFromGpkgPlacementModel = fromJson(getJsonString(data),
                                                       DataFromGpkgPlacementModel.class)
                    .orElseThrow(() -> new IllegalArgumentException("Данные невозможно сконвертировать!"));
        } catch (Exception e) {
            String msg = String.format("Задана некорректная модель GPKG импорта: '%s'", data);
            log.error(msg, e.getCause());

            throw new BadRequestException(msg);
        }

        return this;
    }

    @Override
    public GpkgProcessReport getReport() {
        return this.importReport;
    }

    @Override
    public IExecutor<GpkgProcessReport> setPayload(ProcessModel processModel) {
        this.processModel = processModel;

        return this;
    }

    @Override
    public IExecutor<GpkgProcessReport> validate() {
        this.importReport = new GpkgProcessReport();
        UUID fileId = dataFromGpkgPlacementModel.getFileId();
        try {
            File file = fileRepository
                    .findById(fileId)
                    .orElseThrow(() -> new BadRequestException("Не удалось начать импорт: файл с ID " +
                                                                       " '" + fileId + "' отсутствует в системе. " +
                                                                       "Попробуйте ещё раз загрузить файл и " +
                                                                       "запустить импорт повторно."));
            String filePath = file.getPath();

            try (Connection connection = gpkgReaderService.getConnectionToGpkg(filePath)) {
                if (isGpkgNotDatabaseFile(connection)) {
                    String msg = String.format("Не удалось выполнить импорт GPKG файла. Файл %s не является " +
                                                       "корректным GPKG файлом!!!",
                                               file.getTitle());
                    log.error(msg);

                    throw new BadRequestException(msg);
                }

                //Если пользователь передал данные на импорт -> считать их основными.
                if (dataFromGpkgPlacementModel.getLayersPlacement() != null) {
                    GpkgLayersPlacementModel placementModel = dataFromGpkgPlacementModel.getLayersPlacement();

                    validateAllRastersInLibs(placementModel.getRasterLayers());

                    collectImportModelFromGpkgOrThrow(connection,
                                                      placementModel.getRasterLayers(),
                                                      placementModel.getVectorLayers());

                    updateImportReportWithStatusActive(file.getTitle(), fileId);

                    return this;
                }

                //Если переданы только id файла и id проекта -> импортируем весь вектор, если он есть. Остальное не трогаем.
                List<GpkgContentsBaseDto> gpkgContentsVectorTables = new ArrayList<>(
                        gpkgReaderService.getAllVectorLayersFromGpkgContents(connection));

                if (gpkgContentsVectorTables.isEmpty()) {
                    String msg = "В файле " + file.getTitle() + " нет векторных слоёв. Для импорта растровых данных " +
                            "укажите место сохранения файлов.";
                    log.error(msg);

                    throw new BadRequestException(msg);
                }

                GpkgPayloadData payload = new GpkgPayloadData();
                payload.setGpkgContents(gpkgContentsVectorTables);
                this.importReport.setPayload(payload);

                updateImportReportWithStatusActive(file.getTitle(), fileId);

                return this;
            }
        } catch (Exception e) {
            String msg = "Ошибка при валидации GPKG файла => " + e.getMessage();
            log.error(msg);

            updateImportReportWithStatusError(fileId, msg);

            throw new BadRequestException(importReport.getMessages().toString());
        }
    }

    @Override
    public FilePlacementPayloadModel getPayload() {
        return null;
    }

    @Override
    public boolean notDetached() {
        return false;
    }

    @Override
    public void cleanup() {
        try {
            UUID fileId = dataFromGpkgPlacementModel.getFileId();
            File file = fileRepository
                    .findById(fileId)
                    .orElseThrow(() -> new BadRequestException("Файла с ID " + fileId + "нет в системе"));

            fileRepository.delete(file);

            String filePath = file.getPath();

            fileStorage.deleteIfExists(filePath);
        } catch (Exception e) {
            throw new BadRequestException(
                    "Импорт GPKG завершился ошибкой. Ошибка удаления файла из системы: " + e.getMessage());
        }
    }

    private Optional<String> createDataset(String title) {
        String datasetName = generateDatasetName();
        ResourceQualifier dQualifier = new ResourceQualifier(datasetName);
        ddlSchemas.create(dQualifier);
        SchemasAndTables dataset = new SchemasAndTables(DATASET,
                                                        new ResourceCreateDto(title),
                                                        datasetName,
                                                        ROOT_FOLDER_PATH);
        SchemasAndTables newEntity = schemasAndTablesRepository.save(dataset);

        Permission ownerPermission = permissionsService.addOwnerPermission(SCHEMAS_AND_TABLES_QUALIFIER,
                                                                           newEntity.getId());

        createDatasetRequestHandler.createDatastoreOnGeoserverOrRollback(datasetName,
                                                                         newEntity,
                                                                         dQualifier,
                                                                         ownerPermission);

        return Optional.of(datasetName);
    }

    /**
     * Поля имён: слоя, библиотеки, поля документа; и id документа обязательные для заполнения при импорте растра.
     * Пользователь обязан быть не менее чем редактором к документу в который осуществляется импорт.
     *
     * @param rasterLayers - список моделей импорта растров
     */
    private void validateAllRastersInLibs(List<GpkgTile> rasterLayers) {
        if (rasterLayers.isEmpty()) {
            return;
        }

        for (GpkgTile tile: rasterLayers) {
            if (tile.getLibraryIdentifier() == null || tile.getLibraryIdentifier().isBlank() ||
                    tile.getField() == null || tile.getField().isBlank() ||
                    tile.getDocumentId() == null ||
                    tile.getGpkgLayerTableName() == null || tile.getGpkgLayerTableName().isBlank()) {
                throw new BadRequestException("Модель импорта растра описана некорректно!");
            }

            ResourceQualifier resource = new ResourceQualifier(SYSTEM_SCHEMA_NAME,
                                                               tile.getLibraryIdentifier(),
                                                               tile.getDocumentId(),
                                                               tile.getField(),
                                                               LIBRARY);
            resourceProtector.throwIfNotExist(resource);
            if (!resourceProtector.isEditAllowed(resource)) {
                throw new BadRequestException("У пользователя нет доступа для редактирования документа библиотеки!");
            }
        }
    }

    /**
     * Получаем Connection к файлу через sqlite драйвер. Все перечисленные пользователем объекты должны существовать в
     * gpkg, иначе throw. Если все объекты существуют -> собираем для каждого модель данных для последующего импорта.
     */
    private void collectImportModelFromGpkgOrThrow(Connection connection,
                                                   List<GpkgTile> rasterLayers,
                                                   List<String> vectorLayers) {
        Set<String> layerNames = Stream.concat(rasterLayers.stream().map(GpkgTile::getGpkgLayerTableName),
                                               vectorLayers.stream())
                                       .collect(Collectors.toSet());

        if (!gpkgReaderService.isAllLayersExistInGpkgContents(connection, layerNames)) {
            String msg = "Часть указанных ресурсов не существует в GPKG!";
            log.error(msg);

            throw new BadRequestException(msg);
        }

        List<GpkgContentsFeatures> featuresData = gpkgReaderService.getAllVectorLayersFromGpkgContents(connection);
        featuresData = featuresData.stream()
                                   .filter(v -> layerNames.contains(v.getTableName()))
                                   .collect(Collectors.toList());

        List<GpkgContentsTiles> tilesData = gpkgReaderService.getAllTilesFromGpkgContents(connection);
        tilesData = tilesData.stream()
                             .filter(v -> layerNames.contains(v.getTableName()))
                             .collect(Collectors.toList());

        GpkgPayloadData payload = new GpkgPayloadData();
        List<GpkgContentsBaseDto> gpkgContents = new ArrayList<>();
        gpkgContents.addAll(featuresData);
        gpkgContents.addAll(tilesData);
        payload.setGpkgContents(gpkgContents);

        collectFullTilesImportModel(connection, rasterLayers);
        payload.setTiles(rasterLayers);

        this.importReport.setPayload(payload);
    }

    private void collectFullTilesImportModel(Connection connection,
                                             List<GpkgTile> rasterLayers) {
        Set<String> tilesNames = rasterLayers.stream().map(GpkgTile::getGpkgLayerTableName).collect(Collectors.toSet());
        Map<String, Long> realFileReference = gpkgReaderService.findTilesReferenceByNames(connection, tilesNames);

        for (GpkgTile tile: rasterLayers) {
            String name = tile.getGpkgLayerTableName();
            tile.setGpkgMediaReference(realFileReference.get(name));
            tile.setSrs(gpkgReaderService.getSrcByIdentifier(connection, name));
        }
    }

    private boolean isGpkgNotDatabaseFile(Connection connection) {
        return !gpkgReaderService.isGpkgValidDataBaseFile(connection);
    }

    private void updateImportReportWithStatusActive(String title, UUID fileId) {
        this.importReport.setStatus(ACTIVE);
        this.importReport.setProjectId(dataFromGpkgPlacementModel.getProjectId());
        this.importReport.setFileTitle(title);
        this.importReport.setFileId(fileId);
        this.importReport.getMessages().add("Файл успешно прочитан. Импорт возможен.");
    }

    private void updateImportReportWithStatusError(UUID fileId, String msg) {
        this.importReport.setFileId(fileId);
        this.importReport.setStatus(ERROR);
        this.importReport.getMessages().add(msg);
    }
}
