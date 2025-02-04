package ru.mycrg.data_service.service.cqrs.fts.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.FtsDao;
import ru.mycrg.data_service.dao.ddl.tables.DdlTriggers;
import ru.mycrg.data_service.dto.LibraryModel;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.service.cqrs.fts.requests.FtsReloadRequest;
import ru.mycrg.data_service.service.document_library.DocumentLibraryService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequestHandler;

import java.util.List;

import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.mappers.SchemaMapper.jsonToDto;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.libraryQualifier;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.tableQualifier;
import static ru.mycrg.data_service.service.schemas.SchemaUtil.getFtsProperties;

@Component
public class FtsReloadHandler implements IRequestHandler<FtsReloadRequest, String> {

    private final Logger log = LoggerFactory.getLogger(FtsReloadHandler.class);

    private final FtsDao ftsDao;
    private final DdlTriggers ddlTriggers;
    private final DocumentLibraryService documentLibraryService;
    private final SchemasAndTablesRepository schemasAndTablesRepository;

    public FtsReloadHandler(DocumentLibraryService documentLibraryService,
                            DdlTriggers ddlTriggers,
                            FtsDao ftsDao,
                            SchemasAndTablesRepository schemasAndTablesRepository) {
        this.ftsDao = ftsDao;
        this.ddlTriggers = ddlTriggers;
        this.documentLibraryService = documentLibraryService;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
    }

    @Override
    public String handle(FtsReloadRequest request) {
        log.info("Запущен процесс обновления FTS данных");

        String documents = handleDocuments();
        String layers = handleLayers();

        String out = "Процесс обновления FTS данных завершен:\n" + layers + "\n" + documents;
        log.info(out);

        return out;
    }

    private String handleLayers() {
        Iterable<SchemasAndTables> tables = schemasAndTablesRepository.findAll();
        StringBuilder sb = new StringBuilder();
        tables.forEach(tbl -> {
            if (tbl.isFolder()) {
                return;
            }

            // ищем набор данных для текущей таблицы
            SchemasAndTables dataset = null;
            for (SchemasAndTables item: tables) {
                if (tbl.getPath().equals(item.getPath() + "/" + item.getId())) {
                    dataset = item;
                    break;
                }
            }

            if (dataset == null) {
                log.warn("Не найден набор данных для таблицы {} - {}: обновление FTS данных пропущено",
                         tbl.getIdentifier(), tbl.getTitle());
                return;
            }

            ResourceQualifier tableQualifier = tableQualifier(dataset.getIdentifier(), tbl.getIdentifier());
            SchemaDto schema = jsonToDto(tbl.getSchema());
            if (schema == null) {
                log.warn("Не найдена схема данных для таблицы {} - {}: обновление FTS данных пропущено",
                         tbl.getIdentifier(), tbl.getTitle());
                return;
            }

            log.info("Обновляем FTS данные для таблицы: '{}'", tableQualifier);

            List<String> ftsProperties = getFtsProperties(schema);
            ddlTriggers.createInsertTrigger(tableQualifier, ftsProperties);
            ddlTriggers.createUpdateTrigger(tableQualifier, ftsProperties);
            ddlTriggers.createDeleteTrigger(tableQualifier);

            ftsDao.dropSourceData(tableQualifier);
            ftsDao.copySourceData(tableQualifier, schema);

            sb.append("\n").append(dataset.getIdentifier()).append(".").append(tbl.getIdentifier())
              .append(" ").append(tbl.getTitle());
        });

        return "Таблицы слоев: " + sb;
    }

    private String handleDocuments() {
        StringBuilder sb = new StringBuilder();

        List<LibraryModel> libraries = documentLibraryService.getAll(null);
        libraries.forEach(docLibrary -> {
            ResourceQualifier lQualifier = libraryQualifier(docLibrary.getTableName());
            log.info("Обновляем FTS данные для библиотеки: '{}'", lQualifier);

            SchemaDto schema = docLibrary.getSchema();
            if (schema == null) {
                log.warn("Не найдена схема для библиотеки {} - обновление FTS данных пропущено", lQualifier);
                return;
            }

            List<String> ftsProperties = getFtsProperties(schema);
            ddlTriggers.createInsertTrigger(lQualifier, ftsProperties);
            ddlTriggers.createUpdateTrigger(lQualifier, ftsProperties);
            ddlTriggers.createDeleteTrigger(lQualifier);

            ftsDao.dropSourceData(lQualifier);
            ftsDao.copySourceData(lQualifier, schema);

            sb.append("\n").append(SYSTEM_SCHEMA_NAME).append(".").append(docLibrary.getTableName())
              .append(" ").append(docLibrary.getTitle());
        });

        return "Таблицы документов: " + sb;
    }

}
