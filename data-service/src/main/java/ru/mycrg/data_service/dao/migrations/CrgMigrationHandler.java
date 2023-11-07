package ru.mycrg.data_service.dao.migrations;

import com.zaxxer.hikari.HikariDataSource;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.EncodedResource;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.config.DatasourceFactory;

import java.sql.Connection;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.INITIAL_SCHEMA_NAME;
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
        try (HikariDataSource dsForPublicSchema =
                     datasourceFactory.getNotPoolableDataSource(dbName, INITIAL_SCHEMA_NAME)) {
            JdbcTemplate template = new JdbcTemplate(dsForPublicSchema);

            template.execute("CREATE EXTENSION IF NOT EXISTS postgis");
            template.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm");
        } catch (Exception e) {
            log.error("Не удалось установить расширения для базы: {} По причине: {}", dbName, e.getMessage());
        }

        try (HikariDataSource tempDataSource = datasourceFactory.getNotPoolableDataSource(dbName, SYSTEM_SCHEMA_NAME)) {
            try (final Connection connection = tempDataSource.getConnection()) {
                ScriptUtils.executeSqlScript(connection, getResource("M1__initServiceTables.sql"));
                ScriptUtils.executeSqlScript(connection, getResource("M2__initOldSchemas.sql"));
                ScriptUtils.executeSqlScript(connection, getResource("M3__initDefaultBasemaps.sql"));
                ScriptUtils.executeSqlScript(connection, getResource("M7__initDefaultLibrary.sql"));
                ScriptUtils.executeSqlScript(connection, getResource("M8__addSrid314and315.sql"));
                ScriptUtils.executeSqlScript(connection, getResource("M10__delete_unused_tables.sql"));
                ScriptUtils.executeSqlScript(connection, getResource("M11__updateDocLibraries.sql"));
                ScriptUtils.executeSqlScript(connection, getResource("M12__addFileEntity.sql"));
                ScriptUtils.executeSqlScript(connection, getResource("M13__addTestSchemaForTables.sql"));
                ScriptUtils.executeSqlScript(connection, getResource("M14__addFeatureExtractLibrary.sql"));
                ScriptUtils.executeSqlScript(connection, getResource("M15__updateSchemasAndTables_V2.sql"));
                ScriptUtils.executeSqlScript(connection, getResource("M16__updateBaseMaps.sql"));
                ScriptUtils.executeSqlScript(connection, getResource("M18__fixSchemas.sql"));
                ScriptUtils.executeSqlScript(connection, getResource("M19__addReestrSchemas.sql"));
                ScriptUtils.executeSqlScript(connection, getResource("M20__addTaskAndLog.sql"));
                ScriptUtils.executeSqlScript(connection, getResource("M21__wideTasks.sql"));
                ScriptUtils.executeSqlScript(connection, getResource("M22__initNewSchemas_123.sql"));
                ScriptUtils.executeSqlScript(connection, getResource("M23__updateDocLibraries.sql"));
                ScriptUtils.executeSqlScript(connection, getResource("M24__addColumnDeletedToLibraries.sql"));
                ScriptUtils.executeSqlScript(connection, getResource("M25__tasks2.sql"));
                ScriptUtils.executeSqlScript(connection, getResource("M26__addGisogdPublicationOrder.sql"));
                ScriptUtils.executeSqlScript(connection, getResource("M27__lowercaseAllPropNames.sql"));
                ScriptUtils.executeSqlScript(
                        connection,
                        new EncodedResource(getResource("M28__createFunctionForFts.sql")),
                        false,
                        false,
                        ScriptUtils.DEFAULT_COMMENT_PREFIX,
                        ";;",
                        ScriptUtils.DEFAULT_BLOCK_COMMENT_START_DELIMITER,
                        ScriptUtils.DEFAULT_BLOCK_COMMENT_END_DELIMITER);
                ScriptUtils.executeSqlScript(connection, getResource("M29__addFtsTables.sql"));
            }
        } catch (Exception e) {
            log.error("Не удалось выполнить миграции в полном объеме для базы данных: {} По причине: {}",
                      dbName, e.getMessage());
        }
    }

    @NotNull
    private Resource getResource(String fileName) {
        return ctx.getResource("classpath:sql/" + fileName);
    }
}
