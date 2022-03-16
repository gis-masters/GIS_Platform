package ru.mycrg.data_service.dao.migrations;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.config.DatasourceFactory;

import java.sql.Connection;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;

@Service
public class CrgMigrationHandler {

    private final Logger log = LoggerFactory.getLogger(CrgMigrationHandler.class);

    private final ApplicationContext ctx;
    private final DatasourceFactory datasourceFactory;

    public CrgMigrationHandler(DatasourceFactory datasourceFactory,
                               ApplicationContext ctx) {
        this.ctx = ctx;
        this.datasourceFactory = datasourceFactory;
    }

    public void handle() {
        try {
            log.info("Handle migrations");

            JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getInitialDataSource());

            String selectAllOrganizationsDb = "SELECT datname FROM pg_database WHERE datname like '" +
                    getDefaultDatabaseName() + "%'";

            jdbcTemplate
                    .queryForList(selectAllOrganizationsDb, String.class)
                    .forEach(this::initMigration);
        } catch (DataAccessException e) {
            log.error("Error handle migrations: {}", e.getMessage());
        }
    }

    public void initMigration(String dbName) {
        try {
            HikariDataSource tempDataSource = datasourceFactory.getNotPoolableDataSource(dbName, SYSTEM_SCHEMA_NAME);
            try (final Connection connection = tempDataSource.getConnection()) {
                ScriptUtils.executeSqlScript(connection, ctx.getResource("classpath:sql/M1__initServiceTables.sql"));
                ScriptUtils.executeSqlScript(connection, ctx.getResource("classpath:sql/M2__initOldSchemas.sql"));
                ScriptUtils.executeSqlScript(connection, ctx.getResource("classpath:sql/M3__initDefaultBasemaps.sql"));
                ScriptUtils.executeSqlScript(connection, ctx.getResource("classpath:sql/M7__initDefaultLibrary.sql"));
                ScriptUtils.executeSqlScript(connection, ctx.getResource("classpath:sql/M8__addSrid314and315.sql"));
                ScriptUtils.executeSqlScript(connection,
                                             ctx.getResource("classpath:sql/M9__updateSchemasAndTables.sql"));
                ScriptUtils.executeSqlScript(connection,
                                             ctx.getResource("classpath:sql/M10__delete_unused_tables.sql"));
                ScriptUtils.executeSqlScript(connection, ctx.getResource("classpath:sql/M11__updateDocLibraries.sql"));
                ScriptUtils.executeSqlScript(connection, ctx.getResource("classpath:sql/M12__addFileEntity.sql"));
                ScriptUtils.executeSqlScript(connection,
                                             ctx.getResource("classpath:sql/M13__addTestSchemaForTables.sql"));
            }

            tempDataSource.close();
        } catch (Exception e) {
            log.error("Cant initialize service tables for: {} Reason: {}", dbName, e.getMessage());
        }
    }
}
