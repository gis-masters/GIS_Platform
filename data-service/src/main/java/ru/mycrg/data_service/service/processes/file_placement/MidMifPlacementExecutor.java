package ru.mycrg.data_service.service.processes.file_placement;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
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
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service.service.storage.exceptions.StorageException;
import ru.mycrg.data_service_contract.dto.ImportReport;
import ru.mycrg.data_service_contract.dto.ProcessModel;
import ru.mycrg.data_service_contract.dto.publication.BaseWsProcess;
import ru.mycrg.data_service_contract.dto.publication.GeoserverPublicationData;
import ru.mycrg.data_service_contract.dto.publication.GisPublicationData;
import ru.mycrg.data_service_contract.enums.FilePublicationMode;
import ru.mycrg.data_service_contract.enums.FileType;
import ru.mycrg.data_service_contract.queue.request.FilePublicationEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.springframework.util.StringUtils.getFilename;
import static org.springframework.util.StringUtils.stripFilenameExtension;
import static ru.mycrg.common_utils.CrgGlobalProperties.*;
import static ru.mycrg.data_service.mappers.FileResourceQualifierMapper.mapToFileQualifier;
import static ru.mycrg.data_service.util.JsonConverter.mapper;
import static ru.mycrg.data_service.util.StringUtil.extractHash;
import static ru.mycrg.data_service.util.StringUtil.hashCodeAsString;
import static ru.mycrg.data_service_contract.enums.FileType.MID;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.PENDING;
import static ru.mycrg.data_service_contract.enums.ProcessType.IMPORT;

@Component
public class MidMifPlacementExecutor implements IExecutor<ImportReport>, IFilePlacer {

    private static final Logger log = LoggerFactory.getLogger(MidMifPlacementExecutor.class);

    private final FileRepository fileRepository;
    private final FileStorageService fileStorageService;
    private final IMessageBusProducer messageBus;
    private final IAuthenticationFacade authenticationFacade;
    private final WsNotificationService wsNotificationService;

    private UUID wsMsgId;
    private ImportReport importReport;
    private ProcessModel processModel;
    private FilePlacementPayloadModel payload;

    public MidMifPlacementExecutor(FileRepository fileRepository,
                                   FileStorageService fileStorageService,
                                   IMessageBusProducer messageBus,
                                   IAuthenticationFacade authenticationFacade,
                                   WsNotificationService wsNotificationService) {
        this.fileRepository = fileRepository;
        this.fileStorageService = fileStorageService;
        this.messageBus = messageBus;
        this.authenticationFacade = authenticationFacade;
        this.wsNotificationService = wsNotificationService;
    }

    @Override
    @Transactional
    public ImportReport execute() {
        File baseFile = fileRepository
                .findById(getPayload().getFileId())
                .orElseThrow(() -> new NotFoundException("Не найден файл:" + getPayload().getFileId()));

        String basePath = stripFilenameExtension(baseFile.getPath());
        String baseTitle = stripFilenameExtension(baseFile.getTitle()).toLowerCase();
        Set<String> requiredFiles = Set.of(baseTitle + ".mid",
                                           baseTitle + ".mif");

        String resultHash = extractHash(getFilename(basePath));
        String resultPath = baseFile.getPath();

        String pathTemplate = basePath.replaceAll("\\d+$", "");
        List<File> foundFiles = fileRepository.sameByPathAndIdenticalByTitle(pathTemplate, requiredFiles);
        if (countSameFiles(foundFiles) != requiredFiles.size()) {
            // Группа файлов для размещения имеет новый файл или еще ни разу не публиковалась.

            if (foundFiles.size() != requiredFiles.size()) {
                log.debug("Для базового файла: '{}' не найдено всех требуемых файлов. Найдено: {}",
                          baseFile.getPath(), foundFiles);

                throw new IllegalStateException("Для размещения MID файла не найдены все требуемые файлы");
            }

            // Все ресурсы найдены, высчитываем контрольную сумму всей группы файлов. Переименовываем файлы группы.
            resultHash = generateGroupHash(foundFiles);
            String tmpPath = pathTemplate + resultHash;
            for (File file: foundFiles) {
                String newFilePath = tmpPath + "." + file.getExtension();

                try {
                    fileStorageService.rename(file.getPath(), newFilePath);
                } catch (StorageException e) {
                    throw new IllegalStateException("Не удалось выполнить обработку файла. => " + e.getMessage());
                }

                fileRepository.setPathById(newFilePath, file.getId());

                log.debug("Для файла: '{}' установлен новый путь: '{}'", file.getId(), newFilePath);
            }

            resultPath = tmpPath + "." + baseFile.getExtension();
        }

        // Импорт файла
        importReport = new ImportReport();
        importReport.setProjectId(getPayload().getProjectId());
        importReport.setProjectIsNew(false);

        log.debug("Размещение файла: {}", baseFile.getPath());

        notifyProcessAsPending(importReport, "Размещение файла: " + baseFile.getTitle());

        FileType fileType = FileUtil.defineType(baseFile);
        FileResourceQualifier fileQualifier = mapToFileQualifier(baseFile.getResourceQualifier());
        String nativeName = stripFilenameExtension(getFilename(resultPath));
        String featureTypeName = buildFeatureTypeName(fileQualifier.getTable(),
                                                      fileQualifier.getRecordId(),
                                                      baseFile.getId());

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
                                               resultHash,
                                               fileQualifier.toString()),
                                featureTypeName,
                                nativeName),
                        new GisPublicationData(
                                payload.getProjectId(),
                                fileQualifier.getTable(),
                                fileQualifier.getRecordId(),
                                stripFilenameExtension(baseFile.getTitle()),
                                resultPath,
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
        return MID;
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

    private String generateGroupHash(List<File> foundFiles) {
        long hashCode = foundFiles.stream()
                                  .map(File::getPath)
                                  .mapToLong(path -> new java.io.File(path).hashCode() * -1)
                                  .sum();

        return hashCodeAsString(hashCode);
    }

    private long countSameFiles(List<File> files) {
        if (files.size() <= 1) {
            return 1;
        }

        String etalonPath = stripFilenameExtension(files.get(0).getPath());

        return files.stream()
                    .map(file -> stripFilenameExtension(file.getPath()))
                    .filter(etalonPath::equals)
                    .count();
    }
}
