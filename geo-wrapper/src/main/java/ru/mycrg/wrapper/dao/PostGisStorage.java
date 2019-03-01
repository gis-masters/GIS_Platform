package ru.mycrg.wrapper.dao;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.common.ObjectValidationResult;
import ru.mycrg.common.ValidationMqRequest;
import ru.mycrg.wrapper.service.validation.Util;

import java.text.MessageFormat;
import java.util.List;
import java.util.Map;

@Service
public class PostGisStorage {

    private static final Logger log = LoggerFactory.getLogger(PostGisStorage.class);

    private DatasourceFactory datasourceFactory;

    @Autowired
    public PostGisStorage(DatasourceFactory datasourceFactory) {
        this.datasourceFactory = datasourceFactory;
    }

    public void createDb(final String dbName) throws RuntimeException {
        log.debug("Try create db: {}", dbName);

        JdbcTemplate jdbcTemplate = datasourceFactory.getInitialJdbcTemplate();
        jdbcTemplate.execute(MessageFormat.format("CREATE DATABASE {0};", dbName));
        jdbcTemplate.execute(MessageFormat.format("GRANT ALL ON DATABASE {0} TO fiz;", dbName));

        JdbcTemplate jdbcTemplateNewDb = initConnection(dbName);

        createExtensionForNewDb(jdbcTemplateNewDb);

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

    private void createExtensionForNewDb(JdbcTemplate jdbcTemplate) {
        jdbcTemplate.execute("CREATE EXTENSION postgis;");
    }

    private JdbcTemplate initConnection(final String dbName) {
        return new JdbcTemplate(datasourceFactory.getDatasource(dbName));
    }

}
