package ru.mycrg.data_service.queue.handlers.gpkg;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgFile;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus;
import ru.mycrg.data_service.dao.RecordsDaoDetached;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.repository.FileRepositoryDetached;
import ru.mycrg.data_service.repository.SchemasAndTablesRepositoryDetached;
import ru.mycrg.data_service.service.gpkg.export.GpkgAppender;
import ru.mycrg.data_service_contract.dto.ExportResourceModel;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.queue.request.gpkg.AppendGpkgFilesEvent;
import ru.mycrg.data_service_contract.queue.response.AppendGpkgFileBackwardEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.service.files.FileUtil.getFileFieldNames;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;
import static ru.mycrg.data_service_contract.enums.ValueType.FILE;
import static ru.mycrg.http_client.JsonConverter.fromJson;

@Service
public class AppendGpkgFileEventHandler implements IEventHandler {

    private static final Logger log = LoggerFactory.getLogger(AppendGpkgFileEventHandler.class);

    private final IMessageBusProducer messageBus;
    private final DatasourceFactory datasourceFactory;
    private final FileRepositoryDetached fileRepository;
    private final SchemasAndTablesRepositoryDetached schemasAndTablesRepository;
    private final RecordsDaoDetached recordsDao;
    private final GpkgAppender gpkgAppender;

    public AppendGpkgFileEventHandler(IMessageBusProducer messageBus,
                                      DatasourceFactory datasourceFactory,
                                      FileRepositoryDetached fileRepository,
                                      SchemasAndTablesRepositoryDetached schemasAndTablesRepository,
                                      RecordsDaoDetached recordsDao,
                                      GpkgAppender gpkgAppender) {
        this.messageBus = messageBus;
        this.datasourceFactory = datasourceFactory;
        this.fileRepository = fileRepository;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
        this.recordsDao = recordsDao;
        this.gpkgAppender = gpkgAppender;
    }

    @Override
    public String getEventType() {
        return AppendGpkgFilesEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        AppendGpkgFilesEvent event = (AppendGpkgFilesEvent) mqEvent;

        String pathToFile = event.getPathToGpkg();
        try {
            List<File> files = findAndAppendFiles(pathToFile, event.getDbName(), event.getResourceProjections());
            List<GpkgFile> exportedFiles = files.stream()
                                                .map(f -> new GpkgFile(f.getId(),
                                                                       GpkgProcessStatus.COMPLETED,
                                                                       f.getTitle()))
                                                .collect(Collectors.toList());

            log.debug("Успешно добавили доп. медиа в файл: ({})", pathToFile);

            messageBus.produce(new AppendGpkgFileBackwardEvent(event.getBusinessKey(), DONE, exportedFiles));
        } catch (Exception e) {
            String msg = String.format("При добавлении доп. медиа к файлу: (%s). Произошла ошибка: %s",
                                       pathToFile,
                                       e.getMessage());
            log.error(msg);

            messageBus.produce(new AppendGpkgFileBackwardEvent(event.getBusinessKey(), ERROR, msg));
        }
    }

    public List<File> findAndAppendFiles(String pathToGpkg, String dbName, List<ExportResourceModel> resources) {
        if (resources.isEmpty()) {
            log.debug("Массив ресурсов пуст. Делать нечего!");

            return new ArrayList<>();
        }
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(dbName));

        // 1. Нужно найти UUID всех файлов, которые есть в записях. Если фалов не приложили, то и делать нечего
        List<UUID> filesIds = findAllFilesInTables(resources, jdbcTemplate);
        if (filesIds.isEmpty()) {
            log.debug("Ни в одной записи нет файлов. Делать больше нечего нечего!");

            return new ArrayList<>();
        }

        // 2. Нужно по UUID найти все файлы. Файлы в фичях не имеют прав поэтому нагло ищем все файлы.
        List<File> filesToExport = fileRepository.getAllByIds(jdbcTemplate, filesIds);

        gpkgAppender.appendFiles(pathToGpkg, filesToExport);

        return filesToExport;
    }

    private List<UUID> findAllFilesInTables(List<ExportResourceModel> resources,
                                            JdbcTemplate jdbcTemplate) {
        List<UUID> filesIds = new ArrayList<>();

        for (ExportResourceModel resource: resources) {
            schemasAndTablesRepository
                    .findByIdentifierWithPropertyValueType(jdbcTemplate, resource.getTable(), FILE)
                    .flatMap(table -> fromJson(table.getSchema().toString(), SchemaDto.class))
                    .ifPresentOrElse(tableSchema -> {
                        List<String> fileProps = getFileFieldNames(tableSchema);

                        List<UUID> allRelatedFilesInTable = recordsDao
                                .getAllFilesIdInTable(jdbcTemplate,
                                                      resource.getDataset(),
                                                      resource.getTable(),
                                                      fileProps);

                        filesIds.addAll(allRelatedFilesInTable);
                    }, () -> log.warn("Не удалось найти или распарсить информацию для таблицы {}",
                                      resource.getTable()));
        }

        return filesIds;
    }
}
