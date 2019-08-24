package ru.mycrg.wrapper.dao;

import com.fasterxml.jackson.databind.JsonNode;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.common.*;
import ru.mycrg.common.import_.ColumnProjection;
import ru.mycrg.common.import_.GeoMapping;
import ru.mycrg.common.import_.ImportMqTask;
import ru.mycrg.common.import_.LayerInfo;
import ru.mycrg.wrapper.service.validation.Util;

import java.sql.SQLException;
import java.text.MessageFormat;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static ru.mycrg.wrapper.dao.DaoProperties.OBJECT_ID;
import static ru.mycrg.wrapper.dao.DaoProperties.RULE_ID;

@Service
public class BaseDaoService {

    private static final Logger log = LoggerFactory.getLogger(BaseDaoService.class);

    private ResourceLoader resourceLoader;
    private DatasourceFactory datasourceFactory;

    private static final String AS_IS = "AsIs";
    private static final String NOT_IMPORT = "NotImport";

    @Autowired
    public BaseDaoService(DatasourceFactory datasourceFactory,
                          ResourceLoader resourceLoader) {
        this.datasourceFactory = datasourceFactory;
        this.resourceLoader = resourceLoader;
    }

    public void createDb(final String dbName) throws RuntimeException {
        log.debug("Try create db: {}", dbName);

        JdbcTemplate jdbcTemplate = datasourceFactory.getInitialJdbcTemplate();
        jdbcTemplate.execute(MessageFormat.format("CREATE DATABASE {0} " +
                "WITH OWNER=fiz ENCODING='UTF8' " +
                "TABLESPACE=pg_default CONNECTION LIMIT=-1 TEMPLATE template0;", dbName));
        jdbcTemplate.execute(MessageFormat.format("GRANT ALL ON DATABASE {0} TO fiz;", dbName));

        // Подсоединяемся к только что созданной БД и создаем расширние postgis
        datasourceFactory.getJdbcTemplate(dbName).execute("CREATE EXTENSION postgis;");
        datasourceFactory.removeDatasourceByDbName(dbName);

        log.debug("Successfully created");
    }

    @Transactional
    public List<Map<String, Object>> fetchBatchOfRowsNeededToValidation(JdbcTemplate jdbcTemplate,
                                                                        ResourceProjection resource, int limit) {
        String schema = resource.getSchemaName();
        String table = resource.getTableName();
        String extensionTableName = table + "_extension";

        String rowsNeedingValidation = String.format("select target.*, target.xmin, ext.* from %s.%s as target " +
                "LEFT JOIN %s.%s AS ext ON target.objectid = ext.object_id " +
                "WHERE target.XMIN != ext._xmin OR ext.object_id isnull " +
                "ORDER BY target.objectid " +
                "LIMIT ?", schema, table, schema, extensionTableName);

        log.debug("Sql (rowsNeedingValidation): {}, {}", rowsNeedingValidation, limit);

        return jdbcTemplate.queryForList(rowsNeedingValidation, limit);
    }

    @Transactional
    public void saveValidationResults(JdbcTemplate jdbcTemplate, ResourceProjection resource,
                                      List<ObjectValidationResult> violations) throws NumberFormatException {
        String schema = resource.getSchemaName();
        String extensionTableName = resource.getTableName() + "_extension";

        log.debug("Save validation results for: {}.{} Count: {}", schema, extensionTableName, violations);

        String upsert = String.format("INSERT INTO %s.%s(object_id, violations, _xmin, valid, class_id) " +
                "VALUES (?, to_json(?::json), ?, ?, ?) " +
                "ON CONFLICT(object_id) DO UPDATE " +
                "SET violations = EXCLUDED.violations, _xmin = EXCLUDED._xmin, " +
                "valid = EXCLUDED.valid, class_id = EXCLUDED.class_id", schema, extensionTableName);

        jdbcTemplate
                .batchUpdate(upsert, violations, violations.size(),
                        (ps, violation) -> {
                            int objectId = Integer.parseInt(violation.getObjectId());
                            int classId = Integer.parseInt(violation.getClassId());
                            int xMin = Integer.parseInt(violation.getxMin());
                            JsonNode json = Util.convertToJson(violation);

                            ps.setInt(1, objectId);
                            ps.setString(2, json.toString());
                            ps.setInt(3, xMin);
                            ps.setBoolean(4, violation.getPropertyViolations().isEmpty());
                            ps.setInt(5, classId);
                        });
    }

    @Transactional
    public Long countTotalViolations(JdbcTemplate jdbcTemplate, ResourceProjection resource) {
        String schemaName = resource.getSchemaName();
        String extensionTableName = resource.getTableName() + "_extension";

        String sqlRequest = String.format("SELECT count(*) FROM %s.%s where valid is false",
                schemaName, extensionTableName);

        return jdbcTemplate.queryForObject(sqlRequest, Long.class);
    }

    public Long countTotalRows(ResourceProjection resource) {
        try {
            String schemaName = resource.getSchemaName();
            String sqlRequest = String.format("SELECT count(*) FROM %s.%s", schemaName, resource.getTableName());

            return datasourceFactory.getJdbcTemplate(resource.getDbName()).queryForObject(sqlRequest, Long.class);
        } catch (Exception e) {
            return 0L;
        }
    }

    @Transactional
    public boolean isValidated(JdbcTemplate jdbcTemplate, ResourceProjection resource) {
        String schemaName = resource.getSchemaName();
        String extensionTableName = resource.getTableName() + "_extension";

        String sqlRequest = String.format("SELECT * FROM %s.%s LIMIT 1", schemaName, extensionTableName);

        List<Map<String, Object>> result = jdbcTemplate.queryForList(sqlRequest);

        log.info("isValidated for table: {} / result: {}", extensionTableName, result.isEmpty());

        return !result.isEmpty();
    }

    /**
     * Импорт. <p>
     * Подразумевается копирование таблицы из схемы, в которую выполняется черновой импорт,
     * в схему которая определена как рабочая, но все это в пределах одной БД. <p>
     *
     * @param jdbcTemplate Коннекшн к БД
     * @param request      Даные для импорта
     */
    @Transactional
    public void copy(JdbcTemplate jdbcTemplate, ImportMqTask request) {
        String insertTo = "INSERT INTO " + request.getTargetResource().getSchemaName() + "." +
                request.getTargetResource().getTableName();
        String data = handleInsertMappingColumns(request.getMapping());
        String from = " FROM " + request.getSourceResource().getSchemaName() + "." + '\"' +
                request.getSourceResource().getTableName() + '\"';

        String insertRequest = insertTo + data + from;

        log.debug("SQL import request: {}", insertRequest);

        jdbcTemplate.execute(insertRequest);
    }

    /**
     * Добавление в рабочую таблицу колонок которые имеют тип импорта "AsIs" <p>
     * добавление наших служебных колонок типа: ruleId
     * @param jdbcTemplate Коннекшн к БД
     * @param request      Даные для импорта
     */
    @Transactional
    public void alterTable(JdbcTemplate jdbcTemplate, ImportMqTask request) {
        String targetSchema = request.getTargetResource().getSchemaName();
        String targetTable = request.getTargetResource().getTableName();

        List<GeoMapping> mapping = request.getMapping();

        LayerInfo source = new LayerInfo(RULE_ID, "java.lang.String");
        ColumnProjection target = new ColumnProjection(AS_IS, AS_IS);
        GeoMapping geoMapping = new GeoMapping(source, target);
        addRuleIdMapping(mapping, geoMapping);

        if (isNeedPrepareTable(mapping)) {
            String alterRequest = prepareAlterRequest(mapping, targetSchema, targetTable);

            log.debug("SQL alter request: {}", alterRequest);

            jdbcTemplate.execute(alterRequest);
        } else {
            log.debug("Nothing to prepare for: {}", request.getTargetResource().toString());
        }

        mapping.remove(geoMapping);
    }

    private void addRuleIdMapping(List<GeoMapping> mapping, GeoMapping geoMapping) {
        Optional<GeoMapping> ruleIdMapping = mapping.stream()
                .filter(item -> RULE_ID.equals(item.getSource().getName().toLowerCase()))
                .findFirst();

        if (!ruleIdMapping.isPresent()) {
            mapping.add(geoMapping);
        }
    }

    /**
     * Подразумевает очистку таблиц впаре с таблицей "_extension"
     *
     * @param jdbcTemplate Коннекшн к БД
     * @param targets      Описание ресурсов к которым нужно применить очистку
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

    /**
     * Получить партию данных.
     * Геометрию в бинарном формате сетим в "crg_b_geometry"
     *
     * @param jdbcTemplate Коннекш к БД
     * @param source       Данные ресурса из которого производится выборка
     * @param limit        Размер партии
     * @param offset       Смещение
     */
    @Transactional
    public List<Map<String, Object>> fetchBatch(JdbcTemplate jdbcTemplate, ResourceProjection source, String orderField,
                                                int limit, int offset) {
        String sqlRequest = String.format("SELECT ST_AsBinary(shape) as " +
                        "crg_b_geometry, * FROM %s.%s ORDER BY %s LIMIT ? OFFSET ?",
                source.getSchemaName(), source.getTableName(), orderField);

        log.trace("Fetch sql: {}", sqlRequest);

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
     * <p>
     * В указанной БД создается указанная схема, если схема существует и наполнена таблицами ничего сделано не будет.
     * <p>
     * Шаблон разворачивается следубщим образом, есть sql скрипты сгенереные из БД, но в них указана дефолтная схема
     * "fiz", которая переименовывается в нужное название уже после.
     *
     * @param dbName     Имя БД
     * @param schemaName Имя схемы
     */
    public void initP10Template(String dbName, String schemaName) throws SQLException {
        log.debug("Инициализация шаблонной БД Для: {}", dbName + "." + schemaName);

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

        datasourceFactory.removeDatasourceByDbName(dbName);
    }

    private String generateUpdateRequest(ResourceProjection target, Map<String, Object> item) {
        final String[] sql = {String.format("UPDATE %s.%s SET ", target.getSchemaName(), target.getTableName())};

        item.forEach((key, value) -> {
            if (!OBJECT_ID.equals(key)) {
                if (value.equals(DaoProperties.NULL_MARKER)) {
                    sql[0] = sql[0] + key + "=NULL, ";
                } else {
                    sql[0] = sql[0] + key + "='" + value + "', ";
                }
            }
        });

        return sql[0].substring(0, sql[0].length() - 2) + " WHERE objectid=" + item.get(OBJECT_ID);
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

    private boolean isNeedPrepareTable(List<GeoMapping> mapping) {
        return mapping.stream()
                .anyMatch(geoMapping -> AS_IS.equals(geoMapping.getTarget().getType()));
    }

}
