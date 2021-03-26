package ru.mycrg.wrapper.dao;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service_contract.dto.ResourceProjection;
import ru.mycrg.data_service_contract.dto.import_.ImportMqTask;
import ru.mycrg.data_service_contract.dto.import_.MatchingPair;
import ru.mycrg.data_service_contract.dto.import_.TargetAttribute;
import ru.mycrg.data_service_contract.dto.ObjectValidationResult;
import ru.mycrg.wrapper.service.validation.Util;

import java.util.List;
import java.util.Map;

import static ru.mycrg.wrapper.dao.DaoProperties.AS_IS;
import static ru.mycrg.wrapper.dao.DaoProperties.EXTENSION_POSTFIX;

@Service
public class BaseDaoService {

    private static final Logger log = LoggerFactory.getLogger(BaseDaoService.class);

    ResourceLoader resourceLoader;
    DatasourceFactory datasourceFactory;

    @Autowired
    public BaseDaoService(DatasourceFactory datasourceFactory,
                          ResourceLoader resourceLoader) {
        this.datasourceFactory = datasourceFactory;
        this.resourceLoader = resourceLoader;
    }

    @Transactional
    public List<Map<String, Object>> fetchBatchOfRowsNeededToValidation(JdbcTemplate jdbcTemplate,
                                                                        ResourceProjection resource, int limit) {
        String schema = resource.getSchemaName();
        String table = resource.getTableName();
        String extensionTableName = table + EXTENSION_POSTFIX;

        String rowsNeedingValidation = String.format("select target.*, target.xmin, ext.* from %s.%s as target " +
                "LEFT JOIN %s.%s AS ext ON target.objectid = ext.object_id " +
                "WHERE target.XMIN != ext._xmin OR ext.object_id isnull " +
                "ORDER BY target.objectid " +
                "LIMIT ?", schema, table, schema, extensionTableName);

        log.debug("Sql (rowsNeedingValidation): {}, {}", rowsNeedingValidation, limit);

        return jdbcTemplate.queryForList(rowsNeedingValidation, limit);
    }

    @Transactional
    public void saveValidationResults(JdbcTemplate jdbcTemplate,
                                      ResourceProjection resource,
                                      List<ObjectValidationResult> violations) {
        String schema = resource.getSchemaName();
        String extensionTableName = resource.getTableName() + EXTENSION_POSTFIX;

        log.debug("Save validation results for: {}.{} Count: {}", schema, extensionTableName, violations.size());

        String upsert = String.format("INSERT INTO %s.%s(object_id, violations, _xmin, valid, class_id) " +
                "VALUES (?, to_json(?::json), ?, ?, ?) " +
                "ON CONFLICT(object_id) DO UPDATE " +
                "SET violations = EXCLUDED.violations, _xmin = EXCLUDED._xmin, " +
                "valid = EXCLUDED.valid, class_id = EXCLUDED.class_id", schema, extensionTableName);

        jdbcTemplate
                .batchUpdate(upsert, violations, violations.size(),
                             (ps, violation) -> {
                                 ps.setInt(1, Integer.parseInt(violation.getObjectId()));
                                 ps.setString(2, Util.convertToJson(violation).toString());
                                 ps.setInt(3, Integer.parseInt(violation.getxMin()));
                                 ps.setBoolean(4, isValid(violation));
                                 ps.setInt(5, stringToInt(violation.getClassId()));
                             });
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

    /**
     * Импорт. <p> Подразумевается копирование таблицы из схемы, в которую выполняется черновой импорт, в схему которая
     * определена как рабочая, но все это в пределах одной БД. <p>
     *
     * @param jdbcTemplate Коннекшн к БД
     * @param request      Даные для импорта
     */
    @Transactional
    public void copy(JdbcTemplate jdbcTemplate, ImportMqTask request) {
        String insertTo = "INSERT INTO " + request.getTargetResource().getSchemaName() + "." +
                request.getTargetResource().getTableName();
        String data = handleInsertMappingColumns(request.getPairs());
        String from = " FROM " + request.getSourceResource().getSchemaName() + "." +
                '\"' + request.getSourceResource().getTableName() + '\"';

        String insertRequest = insertTo + data + from;

        log.debug("SQL import request: {}", insertRequest);

        jdbcTemplate.execute(insertRequest);
    }

    /**
     * Удалить таблицу. <br>
     *
     * @param jdbcTemplate Коннекшн к БД
     * @param schema       Название схемы
     * @param table        Название таблицы
     */
    @Transactional
    public void delete(JdbcTemplate jdbcTemplate, String schema, String table) {
        log.debug("Try delete: {}:{}", schema, table);

        jdbcTemplate.execute(String.format("DROP TABLE IF EXISTS %s.\"%s\"", schema, table));
    }

    /**
     * Создаем таблицу исходя из схемы фичи. Создает также таблицу "*_extension"
     */
    public void createTable(JdbcTemplate jdbcTemplate, ImportMqTask importTask) {
        String targetSchema = importTask.getTargetResource().getSchemaName();
        String targetTable = importTask.getTargetResource().getTableName();
        String extensionTable = importTask.getTargetResource().getTableName() + EXTENSION_POSTFIX;
        String target = targetSchema + "." + targetTable;

        String createExtensionTable = SqlGenerator.getExtensionTableRequest(targetSchema, extensionTable);
        String createTable = SqlGenerator.prepareCreateTableRequest(importTask);
        String createSequence = SqlGenerator.getSequenceRequest(target);

        log.debug("SQL create table request: {}", createTable);

        jdbcTemplate.execute(createTable);
        jdbcTemplate.execute(createExtensionTable);
        jdbcTemplate.execute(createSequence);
        jdbcTemplate.execute("ALTER SEQUENCE " + target + "_objectid_seq OWNED BY " + target + ".objectid; ");
        jdbcTemplate.execute(
                "ALTER TABLE ONLY " + target + " ALTER COLUMN objectid " +
                        "SET DEFAULT nextval('" + targetSchema + "." + targetTable + "_objectid_seq'::regclass);");
        jdbcTemplate.execute("CREATE INDEX " + targetTable + "_shape_indx ON " + target + " USING gist (shape)");
    }

    /**
     * Получить партию данных. Геометрию в бинарном формате сетим в "crg_b_geometry"
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

    // TODO: Use batchUpdate (example in saveValidationResults) should be much faster
    public void updateBatch(JdbcTemplate jdbcTemplate, ResourceProjection target, List<Map<String, Object>> nextBatch) {
        nextBatch.forEach(item -> {
            String sqlUpdate = SqlGenerator.prepareUpdateRequest(target, item);

            log.trace("update SQL: {}", sqlUpdate);

            try {
                jdbcTemplate.update(sqlUpdate);
            } catch (DataAccessException e) {
                log.warn("Не удалось обновить строку: {}. Reason: {}", item.values(), e.getMessage());
            }
        });
    }

    private String handleInsertMappingColumns(List<MatchingPair> mapping) {
        String pre = " (";
        String post = ") ";

        StringBuilder targetColumns = new StringBuilder();
        StringBuilder sourceColumns = new StringBuilder("SELECT ");
        for (MatchingPair matchingPair: mapping) {
            TargetAttribute target = matchingPair.getTarget();
            if (target.getType().equals("serial") || target.getType().equals(DaoProperties.NOT_IMPORT)) {
                continue;
            }

            String tName;
            String sName;
            if (target.getType().equals(AS_IS)) {
                tName = sName = matchingPair.getSource().getName();
            } else {
                tName = target.getName();
                sName = matchingPair.getSource().getName();
            }

            if ("the_geom".equals(tName)) {
                targetColumns.append("shape, ");
            } else {
                targetColumns.append(tName).append(", ");
            }

            if ("length".equalsIgnoreCase(sName)) {
                sourceColumns.append("st_length(the_geom), ");
            } else if ("area".equalsIgnoreCase(sName)) {
                sourceColumns.append("st_area(the_geom), ");
            } else {
                sourceColumns.append("\"").append(sName).append("\", ");
            }
        }

        targetColumns = new StringBuilder(pre + targetColumns.substring(0, targetColumns.length() - 2) + post);
        sourceColumns = new StringBuilder(sourceColumns.substring(0, sourceColumns.length() - 2));

        return targetColumns + sourceColumns.toString();
    }

    private boolean isValid(@NotNull ObjectValidationResult result) {
        return result.getPropertyViolations().isEmpty() && result.getObjectViolations().isEmpty();
    }

    @NotNull
    private Integer stringToInt(String param) {
        try {
            return Integer.parseInt(param);
        } catch(NumberFormatException e) {
            return -1;
        }
    }
}
