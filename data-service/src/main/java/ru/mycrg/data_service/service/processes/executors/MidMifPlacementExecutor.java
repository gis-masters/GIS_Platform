package ru.mycrg.data_service.service.processes.executors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dto.FileResourceQualifier;
import ru.mycrg.data_service.dto.WsMessageDto;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.mappers.FileResourceQualifierMapper;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.service.WsNotificationService;
import ru.mycrg.data_service.service.import_.model.FilePlacementPayloadModel;
import ru.mycrg.data_service.service.import_.model.WsImportModel;
import ru.mycrg.data_service.service.processes.FileType;
import ru.mycrg.data_service.service.processes.IExecutor;
import ru.mycrg.data_service.service.processes.IFilePlacer;
import ru.mycrg.data_service_contract.dto.ImportReport;
import ru.mycrg.data_service_contract.dto.ProcessModel;
import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.data_service_contract.enums.ProcessType;
import ru.mycrg.data_service_contract.queue.request.PlaceMidFileEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.HashMap;
import java.util.UUID;

import static org.springframework.util.StringUtils.stripFilenameExtension;
import static ru.mycrg.common_utils.CrgGlobalProperties.*;
import static ru.mycrg.data_service.service.processes.FileType.MID;
import static ru.mycrg.data_service.util.CrsHandler.extractCrsNumber;
import static ru.mycrg.data_service.util.JsonConverter.mapper;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.PENDING;
import static ru.mycrg.data_service_contract.enums.ProcessType.IMPORT;

@Component
public class MidMifPlacementExecutor implements IExecutor<ImportReport>, IFilePlacer {

    private final static String DEFAULT_MID_MIF_STYLE = "generic";

    private final Logger log = LoggerFactory.getLogger(MidMifPlacementExecutor.class);

    private final FileRepository fileRepository;
    private final IMessageBusProducer messageBus;
    private final IAuthenticationFacade authenticationFacade;
    private final WsNotificationService wsNotificationService;

    private UUID wsMsgId;
    private ImportReport importReport;
    private ProcessModel processModel;
    private FilePlacementPayloadModel payload;

    public MidMifPlacementExecutor(FileRepository fileRepository,
                                   IMessageBusProducer messageBus,
                                   IAuthenticationFacade authenticationFacade,
                                   WsNotificationService wsNotificationService) {
        this.fileRepository = fileRepository;
        this.messageBus = messageBus;
        this.authenticationFacade = authenticationFacade;
        this.wsNotificationService = wsNotificationService;
    }

    @Override
    public ImportReport execute() {
        log.debug("Начало публикации Mid/Mif: {}", this.payload);

        importReport = new ImportReport();
        importReport.setProjectId(payload.getProjectId());
        importReport.setProjectIsNew(false);

        File file = fileRepository.findById(payload.getFileId())
                                  .orElseThrow(() -> new NotFoundException("Файл не найден"));

        file.setPath(file.getPath());
        fileRepository.save(file);

        sendWsMsg(PENDING, importReport, "Размещение файла: " + file.getTitle());

        FileResourceQualifier frQualifier = FileResourceQualifierMapper.map(file.getResourceQualifier());
        String featureName = join(frQualifier.getTable(),
                                  file.getId().toString(),
                                  extractCrsNumber(payload.getCrs()).toString());

        messageBus.produce(new PlaceMidFileEvent(authenticationFacade.getAccessToken(),
                                                 this.processModel,
                                                 this.wsMsgId,
                                                 this.payload.getWsUiId(),
                                                 payload.getProjectId(),
                                                 frQualifier.getTable(),
                                                 frQualifier.getRecordId(),
                                                 stripFilenameExtension(file.getTitle()),
                                                 getScratchWorkspaceName(authenticationFacade.getOrganizationId()),
                                                 join(getDefaultStoreName("mid"), featureName),
                                                 featureName,
                                                 file.getPath(),
                                                 payload.getCrs(),
                                                 DEFAULT_MID_MIF_STYLE));

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
            HashMap<?, ?> parsed = mapper.convertValue(data, HashMap.class);

            this.payload = new FilePlacementPayloadModel();
            this.payload.setWsUiId(String.valueOf(parsed.get("wsUiId")));
            this.payload.setProjectId(Long.valueOf(parsed.get("projectId").toString()));
            this.payload.setFileId(UUID.fromString(parsed.get("fileId").toString()));
            this.payload.setCrs(parsed.get("crs").toString());
        } catch (Exception e) {
            String msg = String.format("Задана некорректная модель Shape импорта: %s", data);
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
        return MID;
    }

    @Override
    public boolean notDetached() {
        return false;
    }

    private void sendWsMsg(ProcessStatus status, ImportReport payload, String msg) {
        wsNotificationService.send(
                new WsMessageDto<>(join(IMPORT.name(), MID.name()),
                                   new WsImportModel(wsMsgId, status, payload, msg)),
                this.payload.getWsUiId()
        );
    }
}
