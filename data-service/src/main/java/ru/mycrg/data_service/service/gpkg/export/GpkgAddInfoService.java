package ru.mycrg.data_service.service.gpkg.export;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service_contract.dto.ExportRequestModel;
import ru.mycrg.data_service_contract.dto.ExportResourceModel;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.repository.SchemasAndTablesRepositoryDetached;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service_contract.queue.response.ExportResponseEvent;

import java.util.Optional;

@Service
public class GpkgAddInfoService {

    private final Logger log = LoggerFactory.getLogger(GpkgAddInfoService.class);

    private final GpkgAppender gpkgBuilder;
    private final DatasourceFactory datasourceFactory;
    private final ProcessService processService;
    private final SchemasAndTablesRepositoryDetached schemasAndTablesRepositoryDetached;

    public GpkgAddInfoService(GpkgAppender gpkgBuilder, DatasourceFactory datasourceFactory,
                              ProcessService processService,
                              SchemasAndTablesRepositoryDetached schemasAndTablesRepositoryDetached) {
        this.gpkgBuilder = gpkgBuilder;
        this.datasourceFactory = datasourceFactory;
        this.processService = processService;
        this.schemasAndTablesRepositoryDetached = schemasAndTablesRepositoryDetached;
    }

    public void addSchemaToTable(ExportResponseEvent event) {
        log.debug("Payload ивента на GPKG {}", event.getPayload());

        Process process = processService.getById(event.getProcessId(), event.getDbName());
        ExportRequestModel exportRequestModel = extractExportRequestModel(process.getExtra());

        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(event.getDbName()));
        String gpkgFileName = event.getPayload().toString();

        // Проходим по всем ресурсам в цикле
        for (ExportResourceModel resource: exportRequestModel.getResources()) {
            String tableName = resource.getTable();
            log.debug("Извлеченное tableName векторной таблицы: {}", tableName);

            Optional<SchemasAndTables> schemasAndTables = schemasAndTablesRepositoryDetached.
                    findByIdentifier(jdbcTemplate, tableName);

            if (schemasAndTables.isEmpty()) {
                log.warn("Таблица {} отсутствует в базе данных, найти схему невозможно, пропускаем", tableName);

                continue;
            }

            JsonNode schema = schemasAndTables.get().getSchema();
            log.debug("Схема таблицы {} : {}", tableName, schema);

            gpkgBuilder.append(gpkgFileName, schema, resource);
        }

        log.debug("Процесс добавления схем успешно завершён. Проверяйте файл.");
    }

    public void addTableInfoToGpkg(ExportResponseEvent event) {
        Process process = processService.getById(event.getProcessId(), event.getDbName());

        ExportRequestModel exportRequestModel = extractExportRequestModel(process.getExtra());

        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(event.getDbName()));
        String gpkgFileName = event.getPayload().toString();

        // Проходим по всем ресурсам в цикле
        for (ExportResourceModel resource: exportRequestModel.getResources()) {
            String tableName = resource.getTable();

            Optional<SchemasAndTables> schemasAndTables = schemasAndTablesRepositoryDetached.
                    findByIdentifier(jdbcTemplate, tableName);
            if (schemasAndTables.isEmpty()) {
                log.warn("Таблица {} отсутствует в базе данных, пропускаем", tableName);

                continue;
            }

            //Берём данные векторной таблицы, не Слоя.
            String layerTable = schemasAndTables.get().getTitle();
            log.debug("Извлеченный title векторной таблицы: {}", layerTable);

            String crs = schemasAndTables.get().getCrs();
            log.debug("Извлеченная система координат векторной таблицы: {}", crs);

            gpkgBuilder.append(gpkgFileName, layerTable, crs, resource);
        }

        log.debug("Процесс добавления информации о векторных таблицах. Проверяйте файл.");
    }

    protected static ExportRequestModel extractExportRequestModel(JsonNode extra) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            String jsonString = extra.asText();

            JsonNode parsedJson = mapper.readTree(jsonString);

            return mapper.treeToValue(parsedJson, ExportRequestModel.class);
        } catch (Exception e) {
            throw new IllegalStateException("Ошибка парсинга ExportRequestModel: " + e.getMessage());
        }
    }
}
