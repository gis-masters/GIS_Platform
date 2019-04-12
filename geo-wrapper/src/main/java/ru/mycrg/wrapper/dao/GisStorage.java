package ru.mycrg.wrapper.dao;

import com.fasterxml.jackson.databind.JsonNode;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ScriptException;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.common.ObjectValidationResult;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.ValidationMqRequest;
import ru.mycrg.common.import_.ColumnProjection;
import ru.mycrg.common.import_.GeoMapping;
import ru.mycrg.common.import_.ImportMqRequest;
import ru.mycrg.wrapper.service.validation.Util;

import java.sql.SQLException;
import java.text.MessageFormat;
import java.util.List;
import java.util.Map;

@Service
public class GisStorage {

    private static final Logger log = LoggerFactory.getLogger(GisStorage.class);

    private ResourceLoader resourceLoader;
    private DatasourceFactory datasourceFactory;

    private static final String AS_IS = "AsIs";
    private static final String NOT_IMPORT = "NotImport";

    @Autowired
    public GisStorage(DatasourceFactory datasourceFactory,
                      ResourceLoader resourceLoader) {
        this.datasourceFactory = datasourceFactory;
        this.resourceLoader = resourceLoader;
    }

    public void createDb(final String dbName) throws RuntimeException {
        log.debug("Try create db: {}", dbName);

        JdbcTemplate jdbcTemplate = datasourceFactory.getInitialJdbcTemplate();
        jdbcTemplate.execute(MessageFormat.format("CREATE DATABASE {0};", dbName));
        jdbcTemplate.execute(MessageFormat.format("GRANT ALL ON DATABASE {0} TO fiz;", dbName));

        // Подсоединяемся к только что созданной БД и создаем расширние postgis
        initConnection(dbName).execute("CREATE EXTENSION postgis;");

        datasourceFactory.removeDatasourceByDbName(dbName);

        log.debug("Successfully created");
    }

    @Transactional
    public List<Map<String, Object>> fetchBatchOfRowsNeededToValidation(ValidationMqRequest validationMqRequest,
                                                                        int limit, int offset) {
        String schema = validationMqRequest.getSchemaName();
        String table = validationMqRequest.getEntityType().getTableName();
        String extensionTableName = table + "_extension";

        JdbcTemplate jdbcTemplate = initConnection(validationMqRequest.getDbName());

        String rowsNeedingValidation = String.format("select target.*, target.xmin, ext.* from %s.%s as target " +
                "LEFT JOIN %s.%s AS ext ON target.objectid = ext.object_id " +
                "WHERE target.XMIN != ext._xmin OR ext.object_id isnull " +
                "ORDER BY target.objectid " +
                "LIMIT ? OFFSET ?", schema, table, schema, extensionTableName);

        log.debug("Sql: {}", rowsNeedingValidation);

        return jdbcTemplate.queryForList(rowsNeedingValidation, limit, limit * offset);
    }

    @Transactional
    public void saveValidationResults(ValidationMqRequest mqRequest,
                                      List<ObjectValidationResult> violations) throws NumberFormatException {
        String schema = mqRequest.getSchemaName();
        String extensionTableName = mqRequest.getTableName() + "_extension";

        log.info("Save validation results for: {}.{} Count: {}", schema, extensionTableName, violations.size());

        JdbcTemplate jdbcTemplate = initConnection(mqRequest.getDbName());
        String upsert = String.format("INSERT INTO %s.%s(object_id, violations, _xmin, valid, class_id) " +
                "VALUES (?, to_json(?::json), ?, ?, ?) " +
                "ON CONFLICT(object_id) DO UPDATE " +
                "SET violations = EXCLUDED.violations, _xmin = EXCLUDED._xmin, " +
                "valid = EXCLUDED.valid, class_id = EXCLUDED.class_id", schema, extensionTableName);

        jdbcTemplate
                .batchUpdate(upsert, violations, violations.size(),
                        (ps, violation) -> {
                            int objectId = Integer.valueOf(violation.getObjectId());
                            int classId = Integer.valueOf(violation.getClassId());
                            int xMin = Integer.valueOf(violation.getxMin());
                            JsonNode json = Util.convertToJson(violation);

                            ps.setInt(1, objectId);
                            ps.setString(2, json.toString());
                            ps.setInt(3, xMin);
                            ps.setBoolean(4, violation.getPropertyViolations().isEmpty());
                            ps.setInt(5, classId);
                        });
    }

    @Transactional
    public List<Map<String, Object>> fetchViolationsBatch(JdbcTemplate jdbcTemplate, ResourceProjection target,
                                                          int limit, int offset) {
        String extensionTableName = target.getTableName() + "_extension";

        String sqlRequest = String.format("SELECT * FROM %s.%s where valid is false LIMIT ? OFFSET ?",
                target.getSchemaName(), extensionTableName);

        return jdbcTemplate.queryForList(sqlRequest, limit, limit * offset);
    }

    @Transactional
    public List<Map<String, Object>> getViolations(ValidationMqRequest validationMqRequest) {
        String schemaName = validationMqRequest.getSchemaName();
        String extensionTableName = validationMqRequest.getTableName() + "_extension";
        int limit = validationMqRequest.getSize();
        int offset = validationMqRequest.getPage();

        String sqlRequest = String.format("SELECT * FROM %s.%s where valid is false LIMIT ? OFFSET ?",
                schemaName, extensionTableName);

        return initConnection(validationMqRequest.getDbName()).queryForList(sqlRequest, limit, limit * offset);
    }

    @Transactional
    public Long countTotalViolations(ValidationMqRequest validationMqRequest) {
        String schemaName = validationMqRequest.getSchemaName();
        String extensionTableName = validationMqRequest.getTableName() + "_extension";

        String sqlRequest = String.format("SELECT count(*) FROM %s.%s where valid is false",
                schemaName, extensionTableName);

        return initConnection(validationMqRequest.getDbName()).queryForObject(sqlRequest, Long.class);
    }

    @Transactional
    public boolean isValidated(ValidationMqRequest validationMqRequest) {
        String schemaName = validationMqRequest.getSchemaName();
        String extensionTableName = validationMqRequest.getTableName() + "_extension";

        String sqlRequest = String.format("SELECT * FROM %s.%s LIMIT 1", schemaName, extensionTableName);

        List<Map<String, Object>> result = initConnection(validationMqRequest.getDbName()).queryForList(sqlRequest);

        log.info("isValidated for table: {} / result: {}", extensionTableName, result.isEmpty());

        return !result.isEmpty();
    }

    /**
     * Импорт. <p>
     * Подразумевается копирование таблицы из схемы, в которую выполняется черновой импорт,
     * в схему которая определена как рабочая, но все это в пределах одной БД. <p>
     *  - Добавление в рабочую таблицу колонок которые имеют тип импорта "AsIs" <p>
     *  - Перенос из исходной таблицы в рабочую
     * @param jdbcTemplate Коннекшн к БД
     * @param request Даные для импорта
     */
    @Transactional
    public void doImport(JdbcTemplate jdbcTemplate, ImportMqRequest request) {
        log.debug("doImport from: {} to: {}", request.sourceToString(), request.targetToString());

        String targetSchema = request.getTargetResource().getSchemaName();
        String targetTable = request.getTargetResource().getTableName();

        // Prepare table
        if (isNeedPrepareTable(request.getMapping())) {
            String alterRequest = prepareAlterRequest(request.getMapping(), targetSchema, targetTable);
            log.debug("SQL alter request: {}", alterRequest);
            jdbcTemplate.execute(alterRequest);
        }

        // Import
        String insertRequest = prepareInsertRequest(request);
        log.debug("SQL import request: {}", insertRequest);
        jdbcTemplate.execute(insertRequest);
    }

    /**
     * Подразумевает очистку таблиц впаре с таблицей "_extension"
     *
     * @param jdbcTemplate Коннекшн к БД
     * @param targets Описание ресурсов к которым нужно применить очистку
     */
    @Transactional
    public void truncate(JdbcTemplate jdbcTemplate, List<ResourceProjection> targets) {
        targets.forEach(target -> {
            log.debug("Try truncate: {}", target.toString());

            jdbcTemplate.execute(String.format("TRUNCATE %s.%s", target.getSchemaName(), target.getTableName()));

            String extensionTable = target.getTableName() + "_extension";
            try {
                jdbcTemplate.execute(String.format("TRUNCATE %s.%s", target.getSchemaName(), extensionTable));
            } catch (Exception e) {
                log.warn("Cant truncate table: {} Error: {}", extensionTable, e.getLocalizedMessage());
            }
        });
    }

    public JdbcTemplate initConnection(final String dbName) {
        return new JdbcTemplate(datasourceFactory.getDatasource(dbName));
    }

    private boolean isNeedPrepareTable(List<GeoMapping> mapping) {
        return mapping.stream()
                .anyMatch(geoMapping -> AS_IS.equals(geoMapping.getTarget().getType()));
    }

    /**
     * Получить партию данных.
     * Геометрия в бинарном формате "crg_b_geometry"
     *
     * @param jdbcTemplate Коннекш к БД
     * @param target Данные ресурса из которого производится выборка
     * @param limit Размер партии
     * @param offset Смещение
     */
    public List<Map<String, Object>> fetchBatch(JdbcTemplate jdbcTemplate, ResourceProjection target,
                                                int limit, int offset) {
        String sqlRequest = String.format("SELECT ST_AsBinary(shape) as " +
                        "crg_b_geometry, * FROM %s.%s LIMIT ? OFFSET ?",
                target.getSchemaName(), target.getTableName());

        return jdbcTemplate.queryForList(sqlRequest, limit, limit * offset);
    }

    public void updateBatch(JdbcTemplate jdbcTemplate, ResourceProjection target, List<Map<String, Object>> nextBatch) {
        nextBatch.forEach(item -> {
            String sqlUpdate = generateUpdateRequest(target, item);

            log.trace("update SQL: {}", sqlUpdate);

            jdbcTemplate.update(sqlUpdate);
        });
    }

    /**
     * Инициализация шаблонной структуры 10 приказа. <p>
     *
     * В указанной БД создается указанная схема, если схема существует и наполнена таблицами ничего сделано не будет.
     *
     * Шаблон разворачивается следубщим образом, есть sql скрипты сгенереные из БД, но в них указана дефолтная схема
     * "fiz", которая переименовывается в нужное название уже после.
     * @param dbName Имя БД
     * @param schemaName Имя схемы
     */
    public void initP10Template(String dbName, String schemaName) {
        log.debug("Инициализация шаблонной БД Для: {}", dbName + "." + schemaName);

        try {
            HikariDataSource datasource = datasourceFactory.getDatasource(dbName);
            JdbcTemplate jdbcTemplate = new JdbcTemplate(datasource);

            String checkTablesSql = "select count(*) from information_schema.tables where table_schema = '"
                    + schemaName + "' AND table_type = 'BASE TABLE'";
            int tableCounter = jdbcTemplate.queryForObject(checkTablesSql, Integer.class);
            if (tableCounter > 400) {
                log.debug("Инициализация не требуется");
                return;
            }

            Resource schemaFile = resourceLoader.getResource("classpath:db/p10Template.sql");
            Resource dataFile = resourceLoader.getResource("classpath:db/data.sql");

            // Create schema
            ScriptUtils.executeSqlScript(datasource.getConnection(), schemaFile);

            // Insert data
            ScriptUtils.executeSqlScript(datasource.getConnection(), dataFile);

            // Rename schema
            jdbcTemplate.execute("ALTER SCHEMA fiz RENAME TO " + schemaName);
        } catch (SQLException e) {
            log.error("Неудалось подключится к БД / {}", e.getLocalizedMessage());
        } catch (ScriptException e) {
            log.error("Ошибка при выполнении скрипта: {}", e.getLocalizedMessage());
        }
    }

    private String generateUpdateRequest(ResourceProjection target, Map<String, Object> item) {
        final String[] sql = {String.format("UPDATE %s.%s SET ", target.getSchemaName(), target.getTableName())};

        item.forEach((key, value) -> {
            if (!"objectid".equals(key)) {
                sql[0] = sql[0] + key + "='" + value + "', ";
            }
        });

        return sql[0].substring(0, sql[0].length() - 2) + " WHERE objectid=" + item.get("objectid");
    }

    private String prepareAlterRequest(List<GeoMapping> mapping, String targetSchema, String targetTable) {
//        ALTER TABLE fiz.functionalzone ADD COLUMN IF NOT EXISTS fiz6 INTEGER,
//                                       ADD COLUMN IF NOT EXISTS fiz5 INTEGER,
//                                       ADD COLUMN IF NOT EXISTS fiz4 INTEGER;
        String alter = "ALTER TABLE " + targetSchema + "." + targetTable + " ";
        StringBuilder columns = new StringBuilder();

        for (GeoMapping geoMapping : mapping) {
            ColumnProjection target = geoMapping.getTarget();
            if (target.getType().equals(AS_IS)) {
                columns
                        .append("ADD COLUMN IF NOT EXISTS ")
                        .append(geoMapping.getSource().getName())
                        .append(" ")
                        .append(defineColumnType(geoMapping.getSource().getBinding()))
                        .append(", ");
            }
        }

        columns = new StringBuilder(columns.substring(0, columns.length() - 2));

        return alter + columns;
    }

    private String defineColumnType(String binding) {
        // TODO

        if (binding.contains("Double")) {
            return "numeric";
        }

        if (binding.contains("Integer")) {
            return "integer";
        }

        return "varchar";
    }

    private String prepareInsertRequest(ImportMqRequest request) {
        String insertTo = "INSERT INTO " + request.getTargetResource().getSchemaName() + "." +
                request.getTargetResource().getTableName();
        String data = handleInsertMappingColumns(request.getMapping());
        String from = " FROM " + request.getSourceResource().getSchemaName() + "." + '\"' +
                request.getSourceResource().getTableName() + '\"';

        return insertTo + data + from;
    }

    private String handleInsertMappingColumns(List<GeoMapping> mapping) {
        String pre = " (";
        String post = ") ";

        StringBuilder targetColumns = new StringBuilder();
        StringBuilder sourceColumns = new StringBuilder("SELECT ");
        for (GeoMapping geoMapping : mapping) {
            ColumnProjection target = geoMapping.getTarget();
            if (target.getType().equals("serial") || target.getType().equals(NOT_IMPORT)) {
                continue;
            }

            String tName;
            String sName;
            if (target.getType().equals(AS_IS)) {
                tName = sName = geoMapping.getSource().getName();
            } else {
                tName = target.getName();
                sName = geoMapping.getSource().getName();
            }

            targetColumns.append(tName).append(", ");
            sourceColumns.append("\"").append(sName).append("\", ");
        }

        targetColumns = new StringBuilder(pre + targetColumns.substring(0, targetColumns.length() - 2) + post);
        sourceColumns = new StringBuilder(sourceColumns.substring(0, sourceColumns.length() - 2));

        return targetColumns + sourceColumns.toString();
    }

}
