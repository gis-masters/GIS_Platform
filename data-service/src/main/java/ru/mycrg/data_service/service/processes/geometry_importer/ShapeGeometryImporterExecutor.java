package ru.mycrg.data_service.service.processes.geometry_importer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.import_.model.FilePlacementPayloadModel;
import ru.mycrg.data_service.service.import_.model.GeometryFromShapePlacementPayloadModel;
import ru.mycrg.data_service.service.processes.IExecutor;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.TableService;
import ru.mycrg.data_service.service.resources.protectors.TableProtector;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service_contract.dto.ImportShapeReport;
import ru.mycrg.data_service_contract.dto.ProcessModel;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.enums.FileType;
import ru.mycrg.data_service_contract.queue.request.ShapeLoadedEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.LinkedHashMap;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service.service.storage.FileStorageUtil.generateFileName;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

/**
 * В общем, это уже не про импорт геометрии. Стоит когда-нить переназвать всё что с этим связано.
 * <p>
 * Эта штука импортит все поля. И работаем мы тут с zip архивом. Импорт происходит на geo-wrapper с помощью gdal.
 * Создается временная таблица и мы делаем перенос в целевую.
 */
@Component
public class ShapeGeometryImporterExecutor implements IExecutor<ImportShapeReport> {

    private final Logger log = LoggerFactory.getLogger(ShapeGeometryImporterExecutor.class);

    private final IMessageBusProducer messageBus;

    private final FileStorageService fileStorageService;

    private final TableService tableService;
    private final TableProtector tableProtector;
    private final IAuthenticationFacade authenticationFacade;

    private ProcessModel processModel;
    private ImportShapeReport importReport;
    private GeometryFromShapePlacementPayloadModel payload;

    public ShapeGeometryImporterExecutor(IMessageBusProducer messageBus,
                                         FileStorageService fileStorageService,
                                         IAuthenticationFacade authenticationFacade,
                                         TableService tableService,
                                         TableProtector tableProtector) {
        this.messageBus = messageBus;
        this.fileStorageService = fileStorageService;
        this.authenticationFacade = authenticationFacade;
        this.tableService = tableService;
        this.tableProtector = tableProtector;
    }

    @Override
    public ImportShapeReport execute() {
        importReport = new ImportShapeReport();

        log.debug("Начало публикации импорта геометрии из SHAPE файла: {}", this.payload);

        long orgId = authenticationFacade.getOrganizationId();
        String dbName = getDefaultDatabaseName(orgId);
        String login = authenticationFacade.getLogin();

        String datasetId = payload.getDatasetId();
        String tableName = payload.getTableName();
        ResourceQualifier tQualifier = new ResourceQualifier(datasetId, tableName);

        if (!tableProtector.isEditAllowed(tQualifier)) {
            String msg = String.format("Таблица: '%s' не доступна для обновления.", tQualifier.getTableQualifier());

            log.error(msg);

            importReport.setSuccess(false);
            importReport.setReason(msg);
            importReport.setWarningMessage(msg);
            importReport.setDatasetIdentifier(datasetId);
            importReport.setTableIdentifier(tableName);

            throw new ForbiddenException(msg);
        }

        IResourceModel table = tableService.getInfo(tQualifier);
        SchemaDto schema = table.getSchema();
        if (schema == null) {
            throw new NotFoundException("Не найдена схема для: " + tQualifier.getQualifier());
        }

        if (schema.isReadOnly()) {
            String msg = String.format("Таблица: '%s' не доступна для редактирования.", tQualifier.getTableQualifier());

            log.error(msg);

            importReport.setSuccess(false);
            importReport.setReason(msg);
            importReport.setWarningMessage(msg);
            importReport.setDatasetIdentifier(datasetId);
            importReport.setTableIdentifier(tableName);

            throw new ForbiddenException(msg);
        }

        messageBus.produce(
                new ShapeLoadedEvent(processModel.getId(), dbName, login, payload.getFilePath(), table.getCrs(),
                                     tableName, datasetId, schema.getGeometryType().getType()));

        importReport.setDatasetIdentifier(datasetId);
        importReport.setTableIdentifier(tableName);

        return importReport;
    }

    @Override
    public ImportShapeReport getReport() {
        return this.importReport;
    }

    @Override
    public FilePlacementPayloadModel getPayload() {
        return null;
    }

    @Override
    public IExecutor<ImportShapeReport> setPayload(ProcessModel processModel) {
        this.processModel = processModel;

        return this;
    }

    @Override
    public IExecutor<ImportShapeReport> initialize(Object data) {
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

        String filePath = fileStorageService.copyToExportStorage(file, generateFileName(file.getOriginalFilename()));
        payload.setFilePath(filePath);

        return this;
    }

    @Override
    public IExecutor<ImportShapeReport> validate() {
        // Nothing to do

        return this;
    }

    @Override
    public boolean notDetached() {
        return false;
    }
}
