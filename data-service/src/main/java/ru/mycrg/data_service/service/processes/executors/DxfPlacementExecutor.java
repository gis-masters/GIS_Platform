package ru.mycrg.data_service.service.processes.executors;

import org.jetbrains.annotations.NotNull;
import org.mozilla.universalchardet.UniversalDetector;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dto.FileResourceQualifier;
import ru.mycrg.data_service.dto.WsMessageDto;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.mappers.FileResourceQualifierMapper;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.service.WsNotificationService;
import ru.mycrg.data_service.service.import_.model.FilePlacementPayloadModel;
import ru.mycrg.data_service.service.import_.model.WsImportModel;
import ru.mycrg.data_service.service.processes.FileType;
import ru.mycrg.data_service.service.processes.IExecutor;
import ru.mycrg.data_service.service.processes.IFilePlacer;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service.service.storage.exceptions.StorageException;
import ru.mycrg.data_service.util.FileConverter;
import ru.mycrg.data_service_contract.dto.ImportReport;
import ru.mycrg.data_service_contract.dto.ProcessModel;
import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.data_service_contract.enums.ProcessType;
import ru.mycrg.data_service_contract.queue.request.PlaceDxfFileEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.io.IOException;
import java.util.UUID;

import static java.util.Objects.nonNull;
import static org.springframework.util.StringUtils.stripFilenameExtension;
import static ru.mycrg.common_utils.CrgGlobalProperties.*;
import static ru.mycrg.data_service.service.processes.FileType.DXF;
import static ru.mycrg.data_service.util.CrsHandler.extractCrsNumber;
import static ru.mycrg.data_service.util.JsonConverter.mapper;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.PENDING;
import static ru.mycrg.data_service_contract.enums.ProcessType.IMPORT;

@Component
public class DxfPlacementExecutor implements IExecutor<ImportReport>, IFilePlacer {

    private final Logger log = LoggerFactory.getLogger(DxfPlacementExecutor.class);

    private final FileRepository fileRepository;
    private final IMessageBusProducer messageBus;
    private final FileStorageService fileStorageService;
    private final IAuthenticationFacade authenticationFacade;
    private final WsNotificationService wsNotificationService;

    private UUID wsMsgId;
    private ImportReport importReport;
    private ProcessModel processModel;
    private FilePlacementPayloadModel payload;

    public DxfPlacementExecutor(FileRepository fileRepository,
                                IMessageBusProducer messageBus,
                                FileStorageService fileStorageService,
                                IAuthenticationFacade authenticationFacade,
                                WsNotificationService wsNotificationService) {
        this.fileRepository = fileRepository;
        this.messageBus = messageBus;
        this.fileStorageService = fileStorageService;
        this.authenticationFacade = authenticationFacade;
        this.wsNotificationService = wsNotificationService;
    }

    @Override
    public ImportReport execute() {
        log.debug("Начало публикации DXF: {}", this.payload);

        importReport = new ImportReport();
        importReport.setProjectId(payload.getProjectId());
        importReport.setProjectIsNew(false);

        File file = fileRepository.findById(payload.getFileId())
                                  .orElseThrow(() -> new NotFoundException("Файл не найден"));

        String resultFilePath = changeFileEncoding(file);
        file.setPath(resultFilePath);
        fileRepository.save(file);

        sendWsMsg(PENDING, importReport, "Размещение файла: " + file.getTitle());

        FileResourceQualifier frQualifier = FileResourceQualifierMapper.map(file.getResourceQualifier());
        String featureName = join(frQualifier.getTable(),
                                  file.getId().toString(),
                                  extractCrsNumber(payload.getCrs()).toString());

        messageBus.produce(new PlaceDxfFileEvent(authenticationFacade.getAccessToken(),
                                                 this.processModel,
                                                 this.wsMsgId,
                                                 this.payload.getWsUiId(),
                                                 payload.getProjectId(),
                                                 frQualifier.getTable(),
                                                 frQualifier.getRecordId(),
                                                 stripFilenameExtension(file.getTitle()),
                                                 getScratchWorkspaceName(authenticationFacade.getOrganizationId()),
                                                 join(getDefaultStoreName("dfx"), featureName),
                                                 featureName,
                                                 resultFilePath,
                                                 payload.getCrs(),
                                                 "dxf_schema_v1",
                                                 "dxf_style"));

        return importReport;
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
    public IExecutor<ImportReport> initialize(Object data) {
        this.wsMsgId = UUID.randomUUID();

        try {
            this.payload = mapper.convertValue(data, FilePlacementPayloadModel.class);
        } catch (Exception e) {
            String msg = String.format("Задана некорректная модель DXF импорта: %s", data);
            log.error(msg, e.getCause());

            throw new BadRequestException(msg);
        }

        return this;
    }

    @Override
    public IExecutor<ImportReport> validate() {
        // Nothing to do

        return this;
    }

    @Override
    public ProcessType getType() {
        return IMPORT;
    }

    @Override
    public FileType getFileType() {
        return DXF;
    }

    @Override
    public boolean notDetached() {
        return false;
    }

    @NotNull
    private String changeFileEncoding(File file) {
        String filePath = file.getPath();
        String striped = StringUtils.stripFilenameExtension(filePath);
        String filename = StringUtils.getFilename(filePath);
        String encoding = "_as1251";
        if (nonNull(filename) && !filename.contains(encoding)) {
            String fileEncoding = getFileEncoding(filePath);
            try {
                if ("UTF-8".equalsIgnoreCase(fileEncoding)) {
                    String resultFilePath = striped + encoding + ".dxf";

                    FileConverter.convert(filePath, resultFilePath);
                    fileStorageService.deleteIfExists(filePath);

                    return resultFilePath;
                } else {
                    log.debug("Нет необходимости в конвертации к кодировке 1251");
                }
            } catch (IOException e) {
                String msg = "Failed to convert to encoding 1251";
                log.error(msg, e.getMessage(), e);

                throw new DataServiceException("Не удалось обработать файл");
            } catch (StorageException e) {
                String msg = "Failed to delete temp file";
                log.error(msg, e.getMessage(), e);

                throw new DataServiceException("Не удалось обработать файл");
            }

            return filePath;
        }

        return filePath;
    }

    private void sendWsMsg(ProcessStatus status, ImportReport payload, String msg) {
        wsNotificationService.send(
                new WsMessageDto<>(join(IMPORT.name(), DXF.name()),
                                   new WsImportModel(wsMsgId, status, payload, msg)),
                this.payload.getWsUiId()
        );
    }

    private String getFileEncoding(String path) {
        FileSystemResource fileR = new FileSystemResource(path);
        java.io.File file = fileR.getFile();
        try {
            return UniversalDetector.detectCharset(file);
        } catch (IOException e) {
            String msg = "Не удалось распознать кодировку dxf файла.";
            log.error(msg);

            throw new DataServiceException(msg);
        }
    }
}
