package ru.mycrg.data_service.service.processes.file_placement;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dto.DatasetModel;
import ru.mycrg.data_service.dto.FileResourceQualifier;
import ru.mycrg.data_service.dto.ResourceCreateDto;
import ru.mycrg.data_service.dto.WsMessageDto;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.mappers.FileResourceQualifierMapper;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.service.ProjectsClient;
import ru.mycrg.data_service.service.WsNotificationService;
import ru.mycrg.data_service.service.cqrs.datasets.requests.CreateDatasetRequest;
import ru.mycrg.data_service.service.document_library.RecordServiceFactory;
import ru.mycrg.data_service.service.import_.GmlImporter;
import ru.mycrg.data_service.service.import_.dto.GmlPlacementModel;
import ru.mycrg.data_service.service.import_.model.FilePlacementPayloadModel;
import ru.mycrg.data_service.service.import_.model.WsImportModel;
import ru.mycrg.data_service.service.processes.IExecutor;
import ru.mycrg.data_service_contract.dto.ImportLayerReport;
import ru.mycrg.data_service_contract.dto.ImportReport;
import ru.mycrg.data_service_contract.dto.ProcessModel;
import ru.mycrg.data_service_contract.enums.FileType;
import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.mediator.Mediator;

import java.util.List;
import java.util.UUID;

import static ru.mycrg.common_utils.CrgGlobalProperties.getScratchWorkspaceName;
import static ru.mycrg.common_utils.CrgGlobalProperties.join;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.systemTable;
import static ru.mycrg.data_service.util.JsonConverter.mapper;
import static ru.mycrg.data_service.validators.GmlPlacementModelValidator.throwIfNotValid;
import static ru.mycrg.data_service_contract.enums.FileType.GML;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.*;
import static ru.mycrg.data_service_contract.enums.ProcessType.IMPORT;

@Component
public class GmlPlacementExecutor implements IExecutor<ImportReport>, IFilePlacer {

    private final Logger log = LoggerFactory.getLogger(GmlPlacementExecutor.class);

    private final Mediator mediator;
    private final GmlImporter gmlImporter;
    private final FileRepository fileRepository;
    private final ProjectsClient projectsClient;
    private final RecordServiceFactory recordServiceFactory;
    private final IAuthenticationFacade authenticationFacade;
    private final WsNotificationService wsNotificationService;

    private UUID wsMsgId;
    private GmlPlacementModel payload;
    private ImportReport importReport;

    public GmlPlacementExecutor(Mediator mediator,
                                GmlImporter gmlImporter,
                                FileRepository fileRepository,
                                ProjectsClient projectsClient,
                                RecordServiceFactory recordServiceFactory,
                                IAuthenticationFacade authenticationFacade,
                                WsNotificationService wsNotificationService) {
        this.mediator = mediator;
        this.gmlImporter = gmlImporter;
        this.fileRepository = fileRepository;
        this.projectsClient = projectsClient;
        this.recordServiceFactory = recordServiceFactory;
        this.authenticationFacade = authenticationFacade;
        this.wsNotificationService = wsNotificationService;
    }

    @Override
    public ImportReport execute() {
        // Start publication
        log.debug("Начало публикации GML: {}", this.payload);
        sendWsMsg(PENDING, null, "Инициализация...");

        // Fetch file
        UUID fileId = this.payload.getFileId();
        File file = fileRepository.findById(fileId)
                                  .orElseThrow(() -> new BadRequestException("Не найден файл с id: " + fileId));
        FileResourceQualifier frQualifier = FileResourceQualifierMapper.mapToFileQualifier(file.getResourceQualifier());

        // Fetch document
        IRecord document = recordServiceFactory.get()
                                               .getById(systemTable(frQualifier.getTable()), frQualifier.getRecordId());
        String resultName = getResultName(document, file);

        // Создание и размещение в наборе данных
        sendWsMsg(PENDING, null, "Импорт данных...");

        String dataset = createDataset(resultName);
        importReport = gmlImporter.doImport(file.getPath(), dataset, payload.isInvertedCoordinates());
        List<ImportLayerReport> reports = this.importReport.getImportLayerReports();
        if (reports.isEmpty()) {
            log.warn("Импорт GML завершился неудачей. Не удалось создать слои.");

            importReport.setSuccess(false);
            importReport.setReason("Не удалось создать слои");

            sendWsMsg(ERROR, importReport, "Импорт GML завершился неудачей");

            return importReport;
        }

        log.debug("GML разложен в набор данных: '{}'", this.importReport.getDatasetIdentifier());
        log.debug("Обнаружено {} слоёв", reports.size());
        log.debug("Report: {}", this.importReport);

        long successfulLayersCount = reports.stream().filter(ImportLayerReport::isSuccess).count();
        long failedLayersCount = reports.stream().filter(r -> !r.isSuccess()).count();
        log.debug("Обработано успешно: {} слоёв, с ошибками: {} слоёв", successfulLayersCount, failedLayersCount);

        // Создание и размещение в новой группе в проекте
        Long projectId = this.payload.getProjectId();
        sendWsMsg(PENDING, null, "Подключение слоёв к проекту...");

        projectsClient.createGroup(projectId, resultName).ifPresentOrElse(groupId -> {
            joinSuccessLayers(projectId, groupId, importReport);
        }, () -> {
            String msg = "Не удалось создать группу в проекте: " + projectId;
            log.error(msg);

            throw new DataServiceException(msg);
        });

        log.debug("В существующем проекте: '{}' размещены слои", projectId);

        importReport.setProjectId(projectId);
        importReport.setProjectIsNew(false);
        importReport.setSuccess(true);

        sendWsMsg(failedLayersCount > 0 ? DONE_WITH_WARNINGS : DONE,
                  importReport,
                  failedLayersCount > 0 ? "Импорт GML завершен с предупреждениями" : "Импорт GML завершен");

        return importReport;
    }

    @Override
    public ImportReport getReport() {
        return this.importReport;
    }

    @Override
    public IExecutor<ImportReport> setPayload(ProcessModel processModel) {
        return this;
    }

    @Override
    public FilePlacementPayloadModel getPayload() {
        return null;
    }

    @Override
    public void cleanup() {
        log.debug("Процесс завершился с ошибкой. Операция очистки запущена, но не существует.");
    }

    @Override
    public IExecutor<ImportReport> initialize(Object data) {
        this.wsMsgId = UUID.randomUUID();

        try {
            this.payload = mapper.convertValue(data, GmlPlacementModel.class);
        } catch (Exception e) {
            String msg = String.format("Задана некорректная модель GML импорта: '%s'", data);
            log.error(msg, e.getCause());

            throw new BadRequestException(msg);
        }

        return this;
    }

    @Override
    public IExecutor<ImportReport> validate() {
        throwIfNotValid(this.payload);

        Long projectId = this.payload.getProjectId();
        if (projectsClient.isProjectNotAllowed(projectId)) {
            throw new BadRequestException("Проект: '" + projectId + "' не доступен для записи");
        }

        return this;
    }

    @Override
    public FileType getFileType() {
        return FileType.GML;
    }

    private String getResultName(IRecord document, File file) {
        String fileTitle = StringUtils.stripFilenameExtension(file.getTitle());

        String temp = document.getTitle() + "_" + fileTitle;
        if (temp.length() > 255) {
            return temp.substring(0, 255);
        } else {
            return temp;
        }
    }

    private String createDataset(String datasetName) {
        DatasetModel createdDataset = mediator.execute(
                new CreateDatasetRequest(new ResourceCreateDto(datasetName)));

        return createdDataset.getIdentifier();
    }

    private void sendWsMsg(ProcessStatus status, ImportReport payload, String msg) {
        wsNotificationService.send(
                new WsMessageDto<>(join(IMPORT.name(), GML.name()),
                                   new WsImportModel(wsMsgId, status, payload, msg)),
                this.payload.getWsUiId()
        );
    }

    private void joinSuccessLayers(Long projectId, Long groupId, ImportReport importReport) {
        String dataStoreName = getScratchWorkspaceName(authenticationFacade.getOrganizationId());
        importReport.getImportLayerReports().stream()
                    .filter(ImportLayerReport::isSuccess)
                    .forEach(importLayerReport -> {
                        projectsClient.joinLayer(projectId,
                                                 groupId,
                                                 dataStoreName,
                                                 importReport.getDatasetIdentifier(),
                                                 importLayerReport);
                    });
    }
}
