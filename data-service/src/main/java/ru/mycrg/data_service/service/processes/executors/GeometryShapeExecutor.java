package ru.mycrg.data_service.service.processes.executors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.service.import_.model.GeometryFromShapePlacementPayloadModel;
import ru.mycrg.data_service.service.processes.FileType;
import ru.mycrg.data_service.service.processes.IExecutor;
import ru.mycrg.data_service.service.processes.IFilePlacer;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.TableService;
import ru.mycrg.data_service.service.resources.protectors.TableProtector;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service.util.JsonConverter;
import ru.mycrg.data_service_contract.dto.ImportReport;
import ru.mycrg.data_service_contract.dto.ProcessModel;
import ru.mycrg.data_service_contract.enums.ProcessType;
import ru.mycrg.data_service_contract.queue.request.ShapeLoadedEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.LinkedHashMap;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service.util.JsonConverter.mapper;
import static ru.mycrg.data_service_contract.enums.ProcessType.IMPORT_GEOMETRY;

@Component
public class GeometryShapeExecutor implements IExecutor<ImportReport>, IFilePlacer {

    private final Logger log = LoggerFactory.getLogger(GeometryShapeExecutor.class);

    private final IMessageBusProducer messageBus;

    private final FileStorageService fileStorageService;
    private final Path exportStoragePath;

    private ImportReport importReport;
    private ProcessModel processModel;
    private GeometryFromShapePlacementPayloadModel payload;
    private final IAuthenticationFacade authenticationFacade;
    private final TableService tableService;
    private final TableProtector tableProtector;
    private final ProcessService processService;

    public GeometryShapeExecutor(IMessageBusProducer messageBus,
                                 FileStorageService fileStorageService,
                                 Environment environment,
                                 IAuthenticationFacade authenticationFacade,
                                 TableService tableService,
                                 TableProtector tableProtector,
                                 ProcessService processService) {
        this.messageBus = messageBus;
        this.fileStorageService = fileStorageService;
        this.authenticationFacade = authenticationFacade;
        this.tableService = tableService;
        this.tableProtector = tableProtector;
        this.processService = processService;

        String path = environment.getRequiredProperty("crg-options.exportStoragePath");

        exportStoragePath = Paths.get(path).toAbsolutePath().normalize();
    }

    @Override
    public ImportReport execute() {
        log.debug("Начало публикации импорта геометрии из SHAPE файла: {}", this.payload);

        long orgId = authenticationFacade.getOrganizationId();
        String dbName = getDefaultDatabaseName(orgId);
        ResourceQualifier tQualifier = new ResourceQualifier(payload.getDatasetId(), payload.getTableName());

        if (!tableProtector.isEditAllowed(tQualifier)) {
            String msg = String.format("Таблица: '%s' не доступна для обновления.", tQualifier.getTableQualifier());

            processService.error(dbName,
                                 processModel.getId(),
                                 JsonConverter.toJsonNode("{\"error\"}: \"" + msg + "\""));

            log.error(msg);

            throw new ForbiddenException(msg);
        }

        IResourceModel table = tableService.getInfo(tQualifier);

        messageBus.produce(
                new ShapeLoadedEvent(processModel.getId(), dbName, payload.getFilePath(),
                                     table.getCrs(), payload.getTableName(), payload.getDatasetId()));

        importReport = new ImportReport();
        importReport.setDatasetIdentifier(payload.getDatasetId());
        importReport.setProjectIsNew(false);

        return importReport;
    }

    @Override
    public ImportReport getReport() {
        return this.importReport;
    }

    public GeometryFromShapePlacementPayloadModel getPayload() {
        return payload;
    }

    @Override
    public IExecutor<ImportReport> setPayload(ProcessModel processModel) {
        this.processModel = processModel;

        return this;
    }

    @Override
    public IExecutor<ImportReport> initialize(Object data) {
        MultipartFile file;
        try {
            LinkedHashMap<String, Object> geometryShapeModel = mapper.convertValue(data, LinkedHashMap.class);
            payload = new GeometryFromShapePlacementPayloadModel();
            payload.setDatasetId(String.valueOf(geometryShapeModel.get("datasetId")));
            payload.setFileType(FileType.valueOf(String.valueOf(geometryShapeModel.get("fileType"))));
            payload.setTableName(String.valueOf(geometryShapeModel.get("tableName")));
            file = (MultipartFile) geometryShapeModel.get("file");
        } catch (Exception e) {
            String msg = String.format("Задана некорректная модель Geometry Shape импорта: %s", data);
            log.error(msg, e.getCause());

            throw new BadRequestException(msg);
        }
        String filePath = fileStorageService.storeFile(file,
                                                       exportStoragePath,
                                                       fileStorageService.generateFileName(file));
        payload.setFilePath(filePath);

        return this;
    }

    @Override
    public IExecutor<ImportReport> validate() {
        // Nothing to do

        return this;
    }

    @Override
    public ProcessType getType() {
        return IMPORT_GEOMETRY;
    }

    @Override
    public boolean notDetached() {
        return false;
    }

    @Override
    public FileType getFileType() {
        return FileType.GEOMETRY_FROM_SHAPE;
    }
}
