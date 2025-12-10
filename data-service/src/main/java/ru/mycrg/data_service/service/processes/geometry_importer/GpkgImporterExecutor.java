package ru.mycrg.data_service.service.processes.geometry_importer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgImportReport;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgPayloadData;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgTablesData;
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
import ru.mycrg.data_service.service.import_.model.DataFromGpkgPlacementModel;
import ru.mycrg.data_service.service.import_.model.FilePlacementPayloadModel;
import ru.mycrg.data_service.service.processes.IExecutor;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service.service.processes.file_placement.IFilePlacer;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service_contract.dto.ProcessModel;
import ru.mycrg.data_service_contract.enums.FileType;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus.ACTIVE;
import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus.ERROR;
import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgTableType.VECTOR_DATA_TABLE;
import static ru.mycrg.common_utils.CrgGlobalProperties.generateDatasetName;
import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.dto.ResourceType.DATASET;
import static ru.mycrg.data_service.service.resources.DatasetService.SCHEMAS_AND_TABLES_QUALIFIER;
import static ru.mycrg.data_service.util.JsonConverter.mapper;
import static ru.mycrg.data_service_contract.enums.FileType.GPKG;

@Component
public class GpkgImporterExecutor implements IExecutor<GpkgImportReport>, IFilePlacer {

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

    private ProcessModel processModel;
    private DataFromGpkgPlacementModel dataFromGpkgPlacementModel;
    private GpkgImportReport importReport;

    public GpkgImporterExecutor(IMessageBusProducer messageBus,
                                IAuthenticationFacade authenticationFacade,
                                FileRepository fileRepository,
                                GpkgReaderService gpkgReaderService,
                                DdlSchemas ddlSchemas,
                                SchemasAndTablesRepository schemasAndTablesRepository,
                                PermissionsService permissionsService,
                                CreateDatasetRequestHandler createDatasetRequestHandler,
                                FileStorageService fileStorage,
                                ProcessService processService) {
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
    }

    @Override
    @Transactional
    public GpkgImportReport execute() {
        String title = importReport.getFileTitle().substring(0, importReport.getFileTitle().lastIndexOf('.'));

        String msg = "Процесс импорта GPKG в проект запущен.";
        log.debug(msg);

        long orgId = authenticationFacade.getOrganizationId();

        //TODO: Сделать что-то вроде ("Импорт GPKG " + title) -> придётся переписать тесты
        processService.updateProcessTitle(processModel.getId(), getDefaultDatabaseName(orgId), "Импорт GPKG");

        Optional<String> datasetName;
        try {
            datasetName = createDataset(title);
        } catch (Exception e) {
            msg = "Ошибка создания набора данных для результирующих данных. Причина: " + e.getMessage();
            log.debug(msg);
            this.importReport.setStatus(ERROR);
            this.importReport.setMessages(List.of(msg));

            throw new BadRequestException(msg);
        }

        if (datasetName.isEmpty()) {
            msg = "Ошибка создания набора данных для результирующих данных. Набор данных не был создан корректно.";
            log.debug(msg);
            this.importReport.setStatus(ERROR);
            this.importReport.setMessages(List.of(msg));

            throw new BadRequestException(msg);
        }

        List<String> prev = importReport.getMessages();
        prev.add(msg);
        importReport.setMessages(prev);

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

    @Override
    public FileType getFileType() {
        return GPKG;
    }

    @Override
    public IExecutor<GpkgImportReport> initialize(Object data) {
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
    public GpkgImportReport getReport() {
        return this.importReport;
    }

    @Override
    public IExecutor<GpkgImportReport> setPayload(ProcessModel processModel) {
        this.processModel = processModel;

        return this;
    }

    @Override
    public IExecutor<GpkgImportReport> validate() {
        this.importReport = new GpkgImportReport();
        UUID fileId = dataFromGpkgPlacementModel.getFileId();
        try {
            File file = fileRepository
                    .findById(fileId)
                    .orElseThrow(() -> new BadRequestException("Файла с ID " + fileId + "нет в системе"));
            String filePath = file.getPath();
            String fileTitle = file.getTitle();

            this.importReport.setStatus(ACTIVE);
            this.importReport.setProjectId(dataFromGpkgPlacementModel.getProjectId());
            this.importReport.setFilePath(filePath);
            this.importReport.setFileTitle(fileTitle);
            this.importReport.setFileId(fileId);

            List<GpkgTablesData> tablesInGpkg = gpkgReaderService.getTablesInfo(filePath);
            if (tablesInGpkg.stream().noneMatch(table -> table.getType() == VECTOR_DATA_TABLE)) {
                String msg = "GPKG файл не содержит векторных таблиц.";
                log.debug(msg);
                this.importReport.setStatus(ERROR);
                this.importReport.setMessages(List.of(msg));

                throw new BadRequestException(msg);
            }

            GpkgPayloadData payload = new GpkgPayloadData();
            payload.setTablesInGpkg(tablesInGpkg);
            this.importReport.setPayload(payload);
            List<String> messages = new ArrayList<>();
            messages.add("Файл успешно прочитан. Импорт возможен.");
            this.importReport.setMessages(messages);

            return this;
        } catch (Exception e) {
            log.debug("Ошибка при валидации GPKG файла => {}", e.getMessage());

            this.importReport.setFileId(fileId);
            this.importReport.setStatus(ERROR);
            this.importReport.setMessages(List.of("Не удалось выполнить импорт GPKG файла. " + e.getMessage()));

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
                    "Импорт завершился ошибкой. Ошибка удаления временного файла: " + e.getMessage());
        }
    }
}
