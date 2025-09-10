package ru.mycrg.data_service.queue.handlers;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.GeometryDaoDetached;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.dao.core.CoreTemplateDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.TableCreateDto;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.repository.SchemasAndTablesRepositoryDetached;
import ru.mycrg.data_service.service.cqrs.tables.handlers.CreateTableRequestHandler;
import ru.mycrg.data_service.service.gpkg.importer.GpkgReader;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.util.JsonConverter;
import ru.mycrg.data_service_contract.dto.ErrorReport;
import ru.mycrg.data_service_contract.dto.ImportGpkgReport;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.queue.request.GpkgStartLoaderEvent;
import ru.mycrg.data_service_contract.queue.response.GpkgImportedSucceededEvent;
import ru.mycrg.http_client.HttpClient;
import ru.mycrg.http_client.handlers.BaseRequestHandler;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.*;
import java.util.stream.Collectors;

import static java.time.LocalDateTime.now;
import static ru.mycrg.data_service.config.CrgCommonConfig.DEFAULT_MEDIA_TYPE;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.INITIAL_SCHEMA_NAME;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildCopyGpkgFileQuery;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildDeleteTableQuery;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.util.JsonConverter.toJsonNode;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.*;

@Service
public class ImportGpkgSucceededEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(ImportGpkgSucceededEventHandler.class);

    private final ProcessService processService;
    private final DatasourceFactory datasourceFactory;
    private final CoreTemplateDao coreTemplateDao;
    private final GpkgReader gpkgReader;
    private final CreateTableRequestHandler createTableRequestHandler;
    private final SchemasAndTablesRepositoryDetached schemasAndTablesRepositoryDetached;
    private final GeometryDaoDetached geometryDaoDetached;

    private final URL gisServiceUrl;
    private final HttpClient httpClient;

    public ImportGpkgSucceededEventHandler(ProcessService processService,
                                           DatasourceFactory datasourceFactory,
                                           CoreTemplateDao coreTemplateDao,
                                           GpkgReader gpkgReader,
                                           CreateTableRequestHandler createTableRequestHandler,
                                           SchemasAndTablesRepositoryDetached schemasAndTablesRepositoryDetached,
                                           GeometryDaoDetached geometryDaoDetached1,

                                           Environment environment) throws MalformedURLException {
        this.processService = processService;
        this.datasourceFactory = datasourceFactory;
        this.coreTemplateDao = coreTemplateDao;
        this.gpkgReader = gpkgReader;
        this.createTableRequestHandler = createTableRequestHandler;
        this.schemasAndTablesRepositoryDetached = schemasAndTablesRepositoryDetached;
        this.geometryDaoDetached = geometryDaoDetached1;

        httpClient = new HttpClient(new BaseRequestHandler(new OkHttpClient()));
        gisServiceUrl = new URL(environment.getRequiredProperty("crg-options.gis-service-url"));
    }

    @Override
    public String getEventType() {
        return GpkgImportedSucceededEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        GpkgImportedSucceededEvent event = (GpkgImportedSucceededEvent) mqEvent;
        GpkgStartLoaderEvent requestEvent = event.getImportGpkgEvent();

        log.debug("From GeoPackage event success! Start to import data!");

        String dataset = requestEvent.getSourceDataset();
        TableCreateDto tableCreateDto = gpkgReader.readTableInfoFromGpkgFile(requestEvent.getFilePath());

        //Если gpkg выгружен из нашей таблицы по нашей SchemaDto,
        //то SchemaDto этого класса будет одинаковой для временной и целевой таблицы
        //потому что временная таблица создана путём экспорта слоя по схеме
        SchemaDto targetSchema = gpkgReader.readSchemaFromGpkgFile(requestEvent.getFilePath());

        tableCreateDto.setName(generateSafeTableName(targetSchema.getTableName(), tableCreateDto.getName()));

        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(requestEvent.getDbName()));

        createTableRequestHandler.createTableDetached(jdbcTemplate, targetSchema, dataset, tableCreateDto);
        log.debug("Успешно создали таблицу '{}' для импорта GeoPackage.", tableCreateDto.getName());

        //Записываем данные о созданной таблицы в SchemasAndTables
        Optional<SchemasAndTables> datasetObject;

        datasetObject = schemasAndTablesRepositoryDetached.findByIdentifier(jdbcTemplate, dataset);

        if (datasetObject.isEmpty()) {
            throw new BadRequestException("Набор данных " + dataset + " отсутствует в базе данных.");
        }

        String pathToParent = datasetObject.get().getPath() + "/" + datasetObject.get().getId();
        SchemasAndTables table = new SchemasAndTables(tableCreateDto, pathToParent, TABLE, toJsonNode(targetSchema));

        schemasAndTablesRepositoryDetached.save(jdbcTemplate, table);
        log.debug("Успешно привязали созданную таблицу {} к набору данных: {}.",
                  tableCreateDto.getName(), datasetObject.get().getTitle());

        //Готовимся к переправке данных между временной таблицей и результирующей
        ResourceQualifier targetTable = new ResourceQualifier(dataset,
                                                              tableCreateDto.getName());

        ResourceQualifier sourceTable = new ResourceQualifier(INITIAL_SCHEMA_NAME,
                                                              requestEvent.getSourceTableName());

        Set<String> columnsForExclude = getSystemColumnsForExclude(targetTable);

        //В отличие от shp мы можем всегда собирать SimplePropertyDto из SchemaDto
        //потому что временная таблица когда была создана по той же SchemaDto что и новая
        List<SimplePropertyDto> sourcePropsWithoutSystemFields = targetSchema.getProperties()
                                                                             .stream()
                                                                             .filter(property -> !columnsForExclude.contains(
                                                                                     property.getName()))
                                                                             .collect(Collectors.toList());

        Map<String, Object> systemAutogeneratedField = new HashMap<>();
        systemAutogeneratedField.put(CREATED_AT.getName(), now());
        systemAutogeneratedField.put(CREATED_BY.getName(), requestEvent.getLogin());

        ImportGpkgReport importGpkgReport = new ImportGpkgReport();

        try {
            log.debug("Проверяем всю новую геометрию на валидность перед импортом.");

            int countOfInvalidGeometry = geometryDaoDetached.getInvalidGeometryRowsCount(jdbcTemplate,
                                                                                         sourceTable.getSchema(),
                                                                                         sourceTable.getTable());
            if (countOfInvalidGeometry > 0) {
                importGpkgReport.setMessage("После импорта геометрии было обнаружено '" + countOfInvalidGeometry +
                                                    "' записей с неправильной геометрией.");

                geometryDaoDetached.makeValid(jdbcTemplate, sourceTable.getSchema(), sourceTable.getTable());

                countOfInvalidGeometry = geometryDaoDetached.getInvalidGeometryRowsCount(jdbcTemplate,
                                                                                         sourceTable.getSchema(),
                                                                                         sourceTable.getTable());

                if (countOfInvalidGeometry > 0) {
                    importGpkgReport.setQuantityOfFailedRecords(countOfInvalidGeometry);
                    log.debug("После приведения геометрии к валидному виду, осталось {} невалидных записей.",
                              countOfInvalidGeometry);

                    geometryDaoDetached.deleteAllRowsWithInvalidGeometry(jdbcTemplate, sourceTable);
                    log.debug("Перед копированием было удалено {} невалидных записей.", countOfInvalidGeometry);
                }
            }
        } catch (CrgDaoException e) {
            throw new BadRequestException(e.getMessage());
        }

        try {
            //копируем данные из временной таблицы в целевую
            importGpkgReport.setDatasetIdentifier(targetTable.getSchema());
            importGpkgReport.setTableIdentifier(targetTable.getTableQualifier());

            String copyQuery = buildCopyGpkgFileQuery(sourceTable,
                                                      targetTable,
                                                      sourcePropsWithoutSystemFields,
                                                      targetSchema.getProperties(),
                                                      systemAutogeneratedField);

            Long insertedQuantity = coreTemplateDao.queryForObject(jdbcTemplate, copyQuery, Long.class);
            log.debug("Процесс переноса данных из временной таблицы успешно завершён");

            importGpkgReport.setSuccess(true);
            importGpkgReport.setQuantityOfImportedRecords(insertedQuantity);

            ErrorReport errorReport = event.getErrorReport();
            importGpkgReport.setQuantityOfFailedRecords(errorReport.getFailedRecordCount());
            importGpkgReport.setShapeFileHasProjection(errorReport.isShpFileHasProjection());

            Long projectId = requestEvent.getProjectId();
            log.debug("Начинаем добавлять полученный слой в проект {}", projectId);

            createLayer(requestEvent.getDbName(),
                        requestEvent.getToken(),
                        projectId,
                        dataset,
                        tableCreateDto.getName(),
                        tableCreateDto.getTitle(),
                        tableCreateDto.getCrs(),
                        targetSchema.getName(),
                        targetSchema.getStyleName());

            log.debug("Слой успешно добавлен в проект {}", projectId);

            processService.complete(requestEvent.getDbName(),
                                    requestEvent.getProcessId(),
                                    JsonConverter.toJsonNode(importGpkgReport));
        } catch (Exception e) {
            String msg = "Не удалось провести импорт GPKG несмотря на успешную распаковку. Причина: " + e.getMessage();
            log.error("Необработанное исключение привело к сбою импорта. Подробности: {}", msg);

            importGpkgReport.setSuccess(false);
            importGpkgReport.setQuantityOfImportedRecords(0L);
            importGpkgReport.setErrorMessage(msg);

            processService.error(requestEvent.getDbName(),
                                 requestEvent.getProcessId(),
                                 JsonConverter.toJsonNode(importGpkgReport));
        }

        coreTemplateDao.execute(jdbcTemplate, buildDeleteTableQuery(sourceTable));

        log.debug("Временная таблица {} удалена.", sourceTable.getQualifier());
    }

    private static @NotNull Set<String> getSystemColumnsForExclude(ResourceQualifier targetTable) {
        return Set.of(targetTable.getPrimaryKeyName(),
                      CREATED_AT.getName(),
                      UPDATED_BY.getName(),
                      CREATED_BY.getName(),
                      LAST_MODIFIED.getName());
    }

    private String generateSafeTableName(String nameFromSchema, String requiredName) {
        if (requiredName != null && !requiredName.isBlank()) {
            return requiredName;
        }
        Random random = new Random();

        return String.format("%s_%d_%s", nameFromSchema, Math.abs(random.nextInt(1002)),
                             UUID.randomUUID().toString().substring(0, 5));
    }

    private void createLayer(String dbName,
                             String token,
                             Long projectId,
                             String dataset,
                             String tableName,
                             String title,
                             String nativeCRS,
                             String schemaId,
                             String styleName) {

        // Извлекаем номер из dbName (например, database_2 -> 2)
        int dbId = Integer.parseInt(dbName.substring(dbName.lastIndexOf('_') + 1));
        String scratchDatabaseName = "scratch_database_" + dbId;

        try {
            String jsonPayload = String.format(
                    "{\n" +
                            "  \"enabled\": true,\n" +
                            "  \"position\": -42,\n" +
                            "  \"transparency\": 75,\n" +
                            "  \"minZoom\": 3,\n" +
                            "  \"maxZoom\": 25,\n" +
                            "  \"dataStoreName\": \"%s\",\n" +
                            "  \"complexName\": \"%s:%s\",\n" +
                            "  \"type\": \"vector\",\n" +
                            "  \"dataset\": \"%s\",\n" +
                            "  \"tableName\": \"%s\",\n" +
                            "  \"title\": \"%s\",\n" +
                            "  \"nativeCRS\": \"%s\",\n" +
                            "  \"schemaId\": \"%s\",\n" +
                            "  \"view\": \"\",\n" +
                            "  \"styleName\": \"%s\"\n" +
                            "}",
                    scratchDatabaseName, scratchDatabaseName, tableName, dataset, tableName, title, nativeCRS, schemaId,
                    styleName
            );

            RequestBody payload = RequestBody.create(DEFAULT_MEDIA_TYPE, jsonPayload);

            Request request = new Request.Builder()
                    .addHeader("Authorization", "Bearer " + token)
                    .url(new URL(gisServiceUrl, String.format("projects/%d/layers", projectId)))
                    .post(payload)
                    .build();

            Map<String, Object> result = (Map<String, Object>) httpClient.handleRequest(request).getBody();
            Long id = (long) Double.parseDouble(result.get("id").toString());

            log.debug("id: {}", id);
        } catch (Exception e) {
            log.debug("Не смогли создать слой в проекте");
        }
    }
}
