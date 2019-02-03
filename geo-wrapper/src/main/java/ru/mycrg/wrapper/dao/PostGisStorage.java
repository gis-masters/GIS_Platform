package ru.mycrg.wrapper.dao;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.common.ObjectValidationResult;
import ru.mycrg.common.ValidationMqRequest;

import java.text.MessageFormat;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class PostGisStorage {

    private static final Logger log = LoggerFactory.getLogger(PostGisStorage.class);

    private final JdbcTemplate jdbcTemplate;

    private final Environment environment;

    @Autowired
    public PostGisStorage(JdbcTemplate jdbcTemplate, Environment environment) {
        this.environment = environment;
        this.jdbcTemplate = jdbcTemplate;
    }

    public void createDb(final String dbName) throws RuntimeException {
        log.info("Try create db: {}", dbName);

        jdbcTemplate.execute(MessageFormat.format("CREATE DATABASE {0};", dbName));
        jdbcTemplate.execute(MessageFormat.format("GRANT ALL ON DATABASE {0} TO fiz;", dbName));

        createExtensionForNewDb(dbName);
    }

    public JdbcTemplate initConnection(final String dbName) {
        log.info("Try init connection db: {}", dbName);

        return new JdbcTemplate(getDatasource(dbName));
    }

    public List<Map<String, Object>> fetchBatchOfRowsNeededValidation(JdbcTemplate jdbcTemplate,
                                                                      final String schema, String tableName,
                                                                      int limit, int offset) {
        log.info("Table: {} with limit: {} / offset: {}", tableName, limit, offset);

        String extensionTableName = tableName + "_extension";

        try {
            String rowsNeedingValidation = String.format("select * from %s.%s as target " +
                    "LEFT JOIN %s.%s AS ext ON target.objectid = ext.object_id " +
                    "WHERE target.XMIN != ext._xmin OR ext.object_id isnull " +
                    "ORDER BY target.objectid " +
                    "LIMIT %d OFFSET %d", schema, tableName, schema, extensionTableName, limit, limit * offset);

            return jdbcTemplate.queryForList(rowsNeedingValidation);
        } catch (RuntimeException e) {
            log.error("Failed get rows: {}", e.getLocalizedMessage());

            throw new RuntimeException("Failed get rows: " + e.getLocalizedMessage());
        }
    }

    public void saveValidationResults(JdbcTemplate jdbcTemplate,
                                      List<ObjectValidationResult> violationResults,
                                      String schemaName,
                                      String tableName) {
        log.info("Save validation results for: {}.{} Count: {}", schemaName, tableName, violationResults.size());

        String extensionTableName = tableName + "_extension";

        try {
            String sqlIsRowExist = String.format("");

            List<Map<String, Object>> maps = jdbcTemplate.queryForList(sqlIsRowExist);
        } catch (RuntimeException e) {
            log.error("Failed get rows: {}", e.getLocalizedMessage());

            throw new RuntimeException("Failed get rows: " + e.getLocalizedMessage());
        }
    }

    public List<Map<String, Object>> getViolations(JdbcTemplate jdbcTemplate, ValidationMqRequest validationMqRequest) {
        String schemaName = validationMqRequest.getSchemaName();
        String tableName = validationMqRequest.getTableName();
        int limit = validationMqRequest.getSize();
        int offset = validationMqRequest.getPage();

        String extensionTableName = tableName + "_extension";
        try {
            String sqlRequest = "SELECT * FROM " + schemaName + "." + extensionTableName +
                    " where valid is false LIMIT " + limit + " OFFSET " + limit * offset;

            log.info("Get validations: {}/{} / SQL:{}", limit, offset, sqlRequest);

            return jdbcTemplate.queryForList(sqlRequest);
        } catch (RuntimeException e) {
            log.error("Failed get rows: {}", e.getLocalizedMessage());

            throw new RuntimeException("Failed get rows: " + e.getLocalizedMessage());
        }
    }

    private void createExtensionForNewDb(final String dbName) {
        try (HikariDataSource datasource = getDatasource(dbName)) {
            JdbcTemplate jdbcTemplate = new JdbcTemplate(datasource);
            jdbcTemplate.execute("CREATE EXTENSION postgis;");
        } catch (RuntimeException e) {
            log.warn("Failed create extension: {}", e.getLocalizedMessage());
        }

        log.info("Successfully created");
    }

    // jdbc:postgresql://postgis:5432/postgres
    // jdbc:postgresql://127.0.0.1:5434/postgres
    // jdbc:postgresql://any-other-service-name:5434/postgres
    private String getConnectionUrl(String dbName) {
        String result;

        String[] splitedUrl = Objects.requireNonNull(environment.getProperty("spring.datasource.url")).split("/");
        result = splitedUrl[0] + "//" + splitedUrl[2] + "/" + dbName;

        log.info("Url to new Db: {}", result);
        return result;
    }

    private HikariDataSource getDatasource(String dbName) {
        HikariDataSource newDataSource = new HikariDataSource();
        newDataSource.setJdbcUrl(getConnectionUrl(dbName));
        newDataSource.setUsername(environment.getProperty("spring.datasource.username"));
        newDataSource.setPassword(environment.getProperty("spring.datasource.password"));
        newDataSource.setMaximumPoolSize(1);

        return newDataSource;
    }
}
