package ru.mycrg.data_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.exceptions.ClientException;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.dao.core.CoreTemplateDao;
import ru.mycrg.data_service.dao.ddl.tables.DdlTablesSpecial;
import ru.mycrg.data_service.dao.mappers.SchemasAndTablesMapper;
import ru.mycrg.data_service.dto.ColumnShortInfo;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.mappers.TypeMapper;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.util.JsonConverter;
import ru.mycrg.data_service_contract.dto.ErrorReport;
import ru.mycrg.data_service_contract.dto.ImportShapeReport;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ValueType;
import ru.mycrg.data_service_contract.queue.request.ShapeLoadedEvent;
import ru.mycrg.data_service_contract.queue.response.ShapeImportedSucceededEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static java.time.LocalDateTime.now;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.INITIAL_SCHEMA_NAME;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.*;
import static ru.mycrg.data_service.mappers.SchemaMapper.jsonToDto;
import static ru.mycrg.data_service.util.GeometryHandler.isGeometryTypeMatch;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.*;

@Service
public class ImportShapeSucceededEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(ImportShapeSucceededEventHandler.class);

    private final ProcessService processService;
    private final DatasourceFactory datasourceFactory;
    private final CoreTemplateDao coreTemplateDao;
    private final DdlTablesSpecial ddlTablesSpecial;

    public ImportShapeSucceededEventHandler(ProcessService processService,
                                            DatasourceFactory datasourceFactory,
                                            CoreTemplateDao coreTemplateDao,
                                            DdlTablesSpecial ddlTablesSpecial) {
        this.processService = processService;
        this.datasourceFactory = datasourceFactory;
        this.coreTemplateDao = coreTemplateDao;
        this.ddlTablesSpecial = ddlTablesSpecial;
    }

    @Override
    public String getEventType() {
        return ShapeImportedSucceededEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        ShapeImportedSucceededEvent event = (ShapeImportedSucceededEvent) mqEvent;
        ShapeLoadedEvent requestEvent = event.getImportShapeEvent();
        String login = requestEvent.getLogin();
        ErrorReport errorReport = event.getErrorReport();
        ImportShapeReport importShapeReport = new ImportShapeReport();

        log.debug("In ShapeImportedSucceededEvent! {}", requestEvent);

        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(requestEvent.getDbName()));

        ResourceQualifier sourceTable = new ResourceQualifier(INITIAL_SCHEMA_NAME,
                                                              requestEvent.getSourceTableName());
        ResourceQualifier targetTable = new ResourceQualifier(requestEvent.getDatasetId(),
                                                              requestEvent.getTargetTableName());

        Set<String> columnsForExclude = Set.of(targetTable.getPrimaryKeyName(),
                                               CREATED_AT.getName(),
                                               UPDATED_BY.getName(),
                                               CREATED_BY.getName(),
                                               LAST_MODIFIED.getName());

        List<ColumnShortInfo> tableColumns = getColumnsInfo(jdbcTemplate, sourceTable.getTable());
        tableColumns = tableColumns.stream()
                                   .filter(columnInfo -> !columnsForExclude.contains(columnInfo.getColumnName()))
                                   .collect(Collectors.toList());

        List<SimplePropertyDto> sourcePropsWithoutSystemFields = tableColumns
                .stream()
                .map(columnInfo -> {
                    SimplePropertyDto sourseSimplePropertyDto = new SimplePropertyDto();
                    sourseSimplePropertyDto.setName(columnInfo.getColumnName());
                    sourseSimplePropertyDto.setValueType(TypeMapper.map(columnInfo).orElse(ValueType.STRING));

                    return sourseSimplePropertyDto;
                })
                .collect(Collectors.toList());

        SchemaDto targetSchema = getSchema(jdbcTemplate, targetTable);

        Map<String, Object> systemAutogeneratedField = new HashMap<>();
        systemAutogeneratedField.put(CREATED_AT.getName(), now());
        systemAutogeneratedField.put(CREATED_BY.getName(), login);

        try {
            importShapeReport.setDatasetIdentifier(targetTable.getSchema());
            importShapeReport.setTableIdentifier(targetTable.getTableQualifier());

            throwsIfGeometryIsNotMatching(jdbcTemplate, sourceTable, requestEvent.getGeometryType());
            String copyQuery = buildCopyShpFileQuery(sourceTable,
                                                     targetTable,
                                                     sourcePropsWithoutSystemFields,
                                                     targetSchema.getProperties(),
                                                     systemAutogeneratedField);

            Long insertedQuantity = coreTemplateDao.queryForObject(jdbcTemplate, copyQuery, Long.class);

            importShapeReport.setSuccess(true);
            importShapeReport.setQuantityOfImportedRecords(insertedQuantity);
            importShapeReport.setQuantityOfFailedRecords(errorReport.getFailedRecordCount());
            importShapeReport.setShapeFileHasProjection(errorReport.isShpFileHasProjection());
            importShapeReport.setTargetCrs(requestEvent.getSrs());

            processService.complete(requestEvent.getDbName(),
                                    requestEvent.getProcessId(),
                                    JsonConverter.toJsonNode(importShapeReport));

            log.debug("Процесс успешно завершен");
        } catch (ClientException e) {
            String msg = "Не удалось заимпортировать геометрию. Причина: " + e.getMessage();
            log.error("Не удалось корректно обработать ShapeImportedSucceededEvent. {}", msg);

            importShapeReport.setSuccess(false);
            importShapeReport.setQuantityOfImportedRecords(0L);
            importShapeReport.setWarningMessage(msg);

            processService.error(requestEvent.getDbName(),
                                 requestEvent.getProcessId(),
                                 JsonConverter.toJsonNode(importShapeReport));
        } catch (DataAccessException e) {
            log.debug("Столкнулись с: {} !!! Пробуем перенести только геометрию", String.valueOf(e));
            String copyQuery = buildCopyGeometryQuery(sourceTable, targetTable);

            Long insertedQuantity = coreTemplateDao.queryForObject(jdbcTemplate, copyQuery, Long.class);

            importShapeReport.setSuccess(true);
            importShapeReport.setWarningMessage("Импортирована только геометрия");
            importShapeReport.setQuantityOfImportedRecords(insertedQuantity);
            importShapeReport.setQuantityOfFailedRecords(errorReport.getFailedRecordCount());
            importShapeReport.setShapeFileHasProjection(errorReport.isShpFileHasProjection());
            importShapeReport.setTargetCrs(requestEvent.getSrs());

            processService.complete(requestEvent.getDbName(),
                                    requestEvent.getProcessId(),
                                    JsonConverter.toJsonNode(importShapeReport));

            log.debug("Была импортирована только геометрия");
        } catch (Exception e) {
            String msg = "Не удалось заимпортировать геометрию. Причина: " + e.getMessage();
            log.error("Необработанное исключение привело к сбою импорта. Подробности: {}", msg);

            importShapeReport.setSuccess(false);
            importShapeReport.setQuantityOfImportedRecords(0L);
            importShapeReport.setErrorMessage(msg);

            processService.error(requestEvent.getDbName(),
                                 requestEvent.getProcessId(),
                                 JsonConverter.toJsonNode(importShapeReport));
        }

        coreTemplateDao.execute(jdbcTemplate, buildDeleteTableQuery(sourceTable));

        log.debug("Временная таблица {} удалена.", sourceTable.getQualifier());
    }

    private SchemaDto getSchema(JdbcTemplate jdbcTemplate, ResourceQualifier targetTable) {
        try {
            SchemasAndTables data = jdbcTemplate.queryForObject("SELECT * FROM data.schemas_and_tables where " +
                                                                        "identifier like '" + targetTable.getTable() + "'",
                                                                new SchemasAndTablesMapper());

            return jsonToDto(data.getSchema());
        } catch (Exception e) {
            log.error("Не смогли достать схему, причина: {}", String.valueOf(e));

            throw new ClientException("Не смогли достать схему");
        }
    }

    private List<ColumnShortInfo> getColumnsInfo(JdbcTemplate jdbcTemplate, String tableName) {
        try {
            return ddlTablesSpecial.getColumnShortInfo(tableName, jdbcTemplate);
        } catch (Exception e) {
            log.error("Сбор колонок после импорта shp файла провалился: {}", e.getMessage(), e);

            throw new ClientException("Сбор колонок после импорта shp файла провалился");
        }
    }

    private void throwsIfGeometryIsNotMatching(JdbcTemplate jdbcTemplate,
                                               ResourceQualifier sourceTable,
                                               String targetGeomType) {
        List<String> sourceGeomTypes;

        try {
            String sourceGeomTypeQuery = buildGetGeometryTypeQuery(sourceTable, "wkb_geometry");
            log.debug("SQL get geometry type of table: {}", sourceGeomTypeQuery);
            sourceGeomTypes = coreTemplateDao.queryForList(jdbcTemplate, sourceGeomTypeQuery, String.class);
        } catch (Exception e) {
            String msg = "Не удалось вычислить тип геометрии в таблице: " + sourceTable.getQualifier();
            log.error("{}. Причина: {}", msg, e.getMessage());

            throw new ClientException(msg);
        }

        if (sourceGeomTypes.isEmpty()) {
            String msg = "В Shape файле отсутствуют объекты!";
            log.error(msg);

            throw new ClientException(msg);
        }

        String sourceGeomType = sourceGeomTypes.get(0);
        log.debug("Geometry type: source  {}, target {}", sourceGeomType, targetGeomType);

        if (!isGeometryTypeMatch(sourceGeomType, targetGeomType)) {
            String msg = String.format("Тип импортируемой геометрии не совпадает с типом геометрии в слое! " +
                                               "Исходный тип геометрии: %s, тип геометрии в слое: %s",
                                       sourceGeomType, targetGeomType);
            log.error(msg);

            throw new ClientException(msg);
        }
    }
}
