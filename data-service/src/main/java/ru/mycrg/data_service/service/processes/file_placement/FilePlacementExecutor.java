package ru.mycrg.data_service.service.processes.file_placement;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dto.FileResourceQualifier;
import ru.mycrg.data_service.dto.WsMessageDto;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.service.WsNotificationService;
import ru.mycrg.data_service.service.files.FileUtil;
import ru.mycrg.data_service.service.import_.model.FilePlacementPayloadModel;
import ru.mycrg.data_service.service.import_.model.WsImportModel;
import ru.mycrg.data_service.service.processes.IExecutor;
import ru.mycrg.data_service_contract.dto.ImportReport;
import ru.mycrg.data_service_contract.dto.ProcessModel;
import ru.mycrg.data_service_contract.dto.publication.BaseWsProcess;
import ru.mycrg.data_service_contract.dto.publication.GeoserverPublicationData;
import ru.mycrg.data_service_contract.dto.publication.GisPublicationData;
import ru.mycrg.data_service_contract.enums.FilePublicationMode;
import ru.mycrg.data_service_contract.enums.FileType;
import ru.mycrg.data_service_contract.queue.request.FilePublicationEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.UUID;

import static org.springframework.util.StringUtils.stripFilenameExtension;
import static ru.mycrg.common_utils.CrgGlobalProperties.*;
import static ru.mycrg.data_service.mappers.FileResourceQualifierMapper.mapToFileQualifier;
import static ru.mycrg.data_service.util.JsonConverter.mapper;
import static ru.mycrg.data_service.util.StringUtil.extractHash;
import static ru.mycrg.data_service_contract.enums.FileType.MID;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.PENDING;
import static ru.mycrg.data_service_contract.enums.ProcessType.IMPORT;

@Component
public class FilePlacementExecutor implements IExecutor<ImportReport>, IFilePlacer {

    private final Logger log = LoggerFactory.getLogger(FilePlacementExecutor.class);

    private final FileRepository fileRepository;
    private final IMessageBusProducer messageBus;
    private final IAuthenticationFacade authenticationFacade;
    private final WsNotificationService wsNotificationService;

    private UUID wsMsgId;
    private ImportReport importReport;
    private ProcessModel processModel;
    private FilePlacementPayloadModel payload;

    public FilePlacementExecutor(FileRepository fileRepository,
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
        log.debug("Начало публикации файла. Полное тело: {}", payload);

        importReport = new ImportReport();
        importReport.setProjectId(payload.getProjectId());
        importReport.setProjectIsNew(false);

        File file = fileRepository.findById(payload.getFileId())
                                  .orElseThrow(() -> new NotFoundException("Не найден файл:" + payload.getFileId()));

        log.debug("Размещение файла: {}", file);

        FileType fileType = FileUtil.defineType(file);

        notifyProcessAsPending(importReport, "Размещение файла: " + file.getTitle());

        FileResourceQualifier fileQualifier = mapToFileQualifier(file.getResourceQualifier());
        String filename = StringUtils.getFilename(file.getPath());
        String nativeName = StringUtils.stripFilenameExtension(filename);
        String featureTypeName = buildFeatureTypeName(fileQualifier.getTable(),
                                                      fileQualifier.getRecordId(),
                                                      file.getId());

        messageBus.produce(
                new FilePublicationEvent(
                        fileType,
                        FilePublicationMode.parse(payload.getMode()).orElseThrow(),
                        new BaseWsProcess(
                                authenticationFacade.getAccessToken(),
                                this.processModel,
                                this.wsMsgId,
                                payload.getWsUiId()),
                        new GeoserverPublicationData(
                                getScratchWorkspaceName(authenticationFacade.getOrganizationId()),
                                buildStoreName(authenticationFacade.getOrganizationId(),
                                               fileType.name().toLowerCase(),
                                               extractHash(nativeName),
                                               fileQualifier.toString()),
                                featureTypeName,
                                nativeName),
                        new GisPublicationData(
                                payload.getProjectId(),
                                fileQualifier.getTable(),
                                fileQualifier.getRecordId(),
                                stripFilenameExtension(file.getTitle()),
                                file.getPath(),
                                payload.getStyle(),
                                payload.getCrs())
                ));

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
    public FilePlacementPayloadModel getPayload() {
        return this.payload;
    }

    @Override
    public IExecutor<ImportReport> initialize(Object data) {
        this.wsMsgId = UUID.randomUUID();

        try {
            this.payload = mapper.convertValue(data, FilePlacementPayloadModel.class);
        } catch (Exception e) {
            String msg = String.format("Задана некорректная модель импорта: %s", data);
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
    public FileType getFileType() {
        return null;
    }

    @Override
    public boolean notDetached() {
        return false;
    }

    private void notifyProcessAsPending(ImportReport report, String msg) {
        wsNotificationService.send(
                new WsMessageDto<>(join(IMPORT.name(), MID.name()),
                                   new WsImportModel(wsMsgId, PENDING, report, msg)),
                payload.getWsUiId()
        );
    }
}
