package ru.mycrg.data_service.queue.handlers.gpkg;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.dao.ddl.schemas.DdlSchemasDetached;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.repository.FileRepositoryDetached;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgClearTemplatesEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.util.Optional;

@Service
public class ImportGpkgClearTemplatesEventHandler implements IEventHandler {

    private static final Logger log = LoggerFactory.getLogger(ImportGpkgClearTemplatesEventHandler.class);

    private final DatasourceFactory datasourceFactory;
    private final DdlSchemasDetached ddlSchemas;
    private final FileRepositoryDetached fileRepository;
    private final FileStorageService fileStorage;

    public ImportGpkgClearTemplatesEventHandler(DatasourceFactory datasourceFactory,
                                                DdlSchemasDetached ddlSchemas,
                                                FileRepositoryDetached fileRepository,
                                                FileStorageService fileStorage) {
        this.datasourceFactory = datasourceFactory;
        this.ddlSchemas = ddlSchemas;
        this.fileRepository = fileRepository;
        this.fileStorage = fileStorage;
    }

    @Override
    public String getEventType() {
        return ImportGpkgClearTemplatesEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        final ImportGpkgClearTemplatesEvent event = (ImportGpkgClearTemplatesEvent) mqEvent;

        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(event.getDbName()));

        //1. Удалим схему
        if (!event.getSchema().equals("empty")) {
            try {
                ddlSchemas.drop(jdbcTemplate, event.getSchema());
                log.debug("После импорта GPKG успешно удалили схему '{}' из базы данных", event.getSchema());
            } catch (Exception e) {
                log.error("После импорта GPKG удалить схему '{}' из базы данных не удалось!!!. Причина: {}",
                          event.getSchema(), e.getMessage());
            }
        }

        //2. Удалим файл
        Optional<File> file;
        file = fileRepository.findByIdentifier(jdbcTemplate, event.getFileId());

        file.ifPresent(f -> {
            try {
                fileRepository.deleteByIdentifier(jdbcTemplate, f.getId());
                fileStorage.deleteIfExists(f.getPath());
            } catch (Exception e) {
                log.error("После импорта GPKG удалить файл по пути '{}' не удалось. Причина: {}",
                          event.getFileId(), e.getMessage());

                throw new RuntimeException(e);
            }

            log.debug("После импорта GPKG успешно удалили файл '{}'.", file.get().getTitle());
        });
    }
}
