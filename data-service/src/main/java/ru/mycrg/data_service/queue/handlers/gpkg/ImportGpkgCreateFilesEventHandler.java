package ru.mycrg.data_service.queue.handlers.gpkg;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.common_contracts.generated.data_service.FileResponse;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.repository.FileRepositoryDetached;
import ru.mycrg.data_service.service.cqrs.files.handlers.CreateFileHandlerDetached;
import ru.mycrg.data_service.service.gpkg.importer.GpkgReaderService;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgCreateFilesBackwardEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgCreateFilesEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;

@Service
public class ImportGpkgCreateFilesEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(ImportGpkgCreateFilesEventHandler.class);

    private final CreateFileHandlerDetached createFileHandler;
    private final DatasourceFactory datasourceFactory;
    private final FileRepositoryDetached fileRepository;
    private final GpkgReaderService gpkgReaderService;
    private final IMessageBusProducer messageBus;

    public ImportGpkgCreateFilesEventHandler(CreateFileHandlerDetached createFileHandler,
                                             DatasourceFactory datasourceFactory,
                                             FileRepositoryDetached fileRepository,
                                             GpkgReaderService gpkgReaderService,
                                             IMessageBusProducer messageBus) {
        this.createFileHandler = createFileHandler;
        this.datasourceFactory = datasourceFactory;
        this.fileRepository = fileRepository;
        this.gpkgReaderService = gpkgReaderService;
        this.messageBus = messageBus;
    }

    @Override
    public String getEventType() {
        return ImportGpkgCreateFilesEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        final ImportGpkgCreateFilesEvent event = (ImportGpkgCreateFilesEvent) mqEvent;
        final JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(event.getDbName()));
        final UUID gpkgFileId = event.getGpkgFileId();

        if (event.getFileIds().isEmpty()) {
            log.error("Массив файлов пуст, вероятно в json фичи указано просто '[]'");
            messageBus.produce(new ImportGpkgCreateFilesBackwardEvent(DONE,
                                                                      event.getBusinessKey(),
                                                                      new HashMap<>()));

            return;
        }

        try {
            Optional<File> file = fileRepository.findByIdentifier(jdbcTemplate, gpkgFileId);

            if (file.isEmpty()) {
                log.error("Найти GPKG с uuid {} не удалось!", gpkgFileId);
                messageBus.produce(new ImportGpkgCreateFilesBackwardEvent(ERROR,
                                                                          event.getBusinessKey(),
                                                                          new HashMap<>()));

                return;
            }

            Map<UUID, MultipartFile> files = gpkgReaderService.getFilesFromGpkg(file.get().getPath(),
                                                                                event.getFileIds());

            Map<UUID, UUID> oldNewIds = new HashMap<>();
            for (Map.Entry<UUID, MultipartFile> curFile: files.entrySet()) {
                Optional<FileResponse> createdFile = createFileHandler.singleFileHandle(curFile.getValue(),
                                                                                        jdbcTemplate,
                                                                                        event.getLogin());

                createdFile.ifPresent(fileResponse -> oldNewIds.put(curFile.getKey(), fileResponse.getId()));
            }

            messageBus.produce(new ImportGpkgCreateFilesBackwardEvent(DONE,
                                                                      event.getBusinessKey(),
                                                                      oldNewIds));
        } catch (Exception e) {
            log.error("При добавлении файлов из GPKG '{}' произошла ошибка: {}!!!", gpkgFileId, e.getMessage());

            messageBus.produce(new ImportGpkgCreateFilesBackwardEvent(ERROR,
                                                                      event.getBusinessKey(),
                                                                      new HashMap<>()));
        }
    }
}
