package ru.mycrg.data_service.dao;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Service;

import java.sql.Connection;

import static ru.mycrg.data_service.dao.CrgDataSourcesPool.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dao.CrgDataSourcesPool.DEFAULT_DB_NAME;

@Service
public class CrgMigrationHandler {

    public static final Logger log = LoggerFactory.getLogger(CrgMigrationHandler.class);

    private final ApplicationContext ctx;
    private final CrgDataSourcesPool crgDataSourcesPool;

    public CrgMigrationHandler(CrgDataSourcesPool crgDataSourcesPool,
                               ApplicationContext ctx) {
        this.ctx = ctx;
        this.crgDataSourcesPool = crgDataSourcesPool;
    }

    public void handle() {
        try {
            log.info("Handle migrations");

            JdbcTemplate jdbcTemplate = new JdbcTemplate(crgDataSourcesPool.getInitialDataSource());

            String selectAllOrganizationsDb = "SELECT datname FROM pg_database WHERE datname like '" +
                    DEFAULT_DB_NAME + "%'";

            jdbcTemplate
                    .queryForList(selectAllOrganizationsDb, String.class)
                    .forEach(this::initMigration);
        } catch (DataAccessException e) {
            log.error("Error handle migrations: {}", e.getMessage());
        }
    }

    public void initMigration(String dbName) {
        try {
            HikariDataSource tempDataSource = crgDataSourcesPool.getNotPoolableDataSource(dbName, SYSTEM_SCHEMA_NAME);
            try (final Connection connection = tempDataSource.getConnection()) {
                ScriptUtils.executeSqlScript(connection, ctx.getResource("classpath:sql/M1__initServiceTables.sql"));
                ScriptUtils.executeSqlScript(connection, ctx.getResource("classpath:sql/M2__initOldSchemas.sql"));
                ScriptUtils.executeSqlScript(connection, ctx.getResource("classpath:sql/M3__initDefaultBasemaps.sql"));
                ScriptUtils.executeSqlScript(connection, ctx.getResource("classpath:sql/M4__initDefaultLibraries.sql"));
                ScriptUtils.executeSqlScript(connection, ctx.getResource("classpath:sql/M5__alterDocumentsTable.sql"));
            }

            tempDataSource.close();
        } catch (Exception e) {
            log.error("Cant initialize service tables for: {} Reason: {}", dbName, e.getMessage());
        }
    }
}
