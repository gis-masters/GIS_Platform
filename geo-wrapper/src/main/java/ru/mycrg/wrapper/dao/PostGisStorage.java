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
import ru.mycrg.wrapper.dto.ViolationsSaveDto;
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
    public void saveValidationResults(ViolationsSaveDto dto, String objectIdKey) throws NumberFormatException {
        String schema = dto.getSchemaName();
        String extensionTableName = dto.getTableName() + "_extension";
        List<ObjectValidationResult> violationResults = dto.getViolationResults();

        log.info("Save validation results for: {}.{} Count: {}", schema, extensionTableName, violationResults.size());

        JdbcTemplate jdbcTemplate = initConnection(dto.getDbName());
        violationResults.forEach(validationResult -> {
            String objectId = validationResult.getObjectId();
            String classId = validationResult.getClassId();

            String sqlIsRowExist = String.format("SELECT * FROM %s.%s where ? = ?", schema, extensionTableName);
            var isRowExist = jdbcTemplate.queryForList(sqlIsRowExist, objectIdKey, objectId);

            JsonNode json = Util.convertToJson(validationResult.getViolations());
            String xMin = validationResult.getxMin();

            if (isRowExist.isEmpty()) { // Add new row
                String sqlAddRow = String.format("INSERT INTO %s.%s(violations, _xmin, valid, object_id, class_id) " +
                                "VALUES ('%s', ?, ?, ?, ?);", schema, extensionTableName, json.toString());

                jdbcTemplate.update(sqlAddRow,
                        Integer.valueOf(xMin), validationResult.getViolations().isEmpty(),
                        Integer.valueOf(objectId), Integer.valueOf(classId));
            } else { // Update row
                String sqlUpdateRow = String.format("UPDATE %s.%s SET violations='%s', _xmin=?, valid=?, class_id=? " +
                                "WHERE object_id = ?", schema, extensionTableName, json.toString());

                jdbcTemplate.update(sqlUpdateRow,
                        Integer.valueOf(xMin), validationResult.getViolations().isEmpty(),
                        Integer.valueOf(objectId), Integer.valueOf(classId));
            }
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

    private void createExtensionForNewDb(JdbcTemplate jdbcTemplate) {
        jdbcTemplate.execute("CREATE EXTENSION postgis;");
    }

    private JdbcTemplate initConnection(final String dbName) {
        return new JdbcTemplate(datasourceFactory.getDatasource(dbName));
    }
}
