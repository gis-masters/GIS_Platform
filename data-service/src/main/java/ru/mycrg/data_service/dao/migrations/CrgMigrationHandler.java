package ru.mycrg.data_service.dao.migrations;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.EncodedResource;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.dao.ddl.tables.DdlTriggers;
import ru.mycrg.data_service.dao.mappers.DocLibraryMapper;
import ru.mycrg.data_service.dao.mappers.SchemasAndTablesMapper;
import ru.mycrg.data_service.entity.DocumentLibrary;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.INITIAL_SCHEMA_NAME;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildCopyDataToFtsLayersQuery;
import static ru.mycrg.data_service.mappers.SchemaMapper.jsonToDto;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.libraryQualifier;
import static ru.mycrg.data_service.service.schemas.SchemaUtil.getFtsProperties;
import static ru.mycrg.data_service.util.TableUtils.getParentId;

@Service
public class CrgMigrationHandler {

    private final Logger log = LoggerFactory.getLogger(CrgMigrationHandler.class);

    private final ApplicationContext ctx;
    private final DatasourceFactory datasourceFactory;

    @Value("${crg-options.initFullTextSearch:false}")
    private boolean initFullTextSearch;

    @Value("${spring.flyway.placeholders.db_owner}")
    private String dbOwner;

    public CrgMigrationHandler(ApplicationContext ctx,
                               DatasourceFactory datasourceFactory) {
        this.ctx = ctx;
        this.datasourceFactory = datasourceFactory;
    }

    public void handle() {
        try {
            log.info("*** Handle migrations ***");

            JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getInitialDataSource());

            String selectAllOrganizationsDbNamesQuery = "SELECT datname FROM pg_database " +
                    "WHERE datname like '" + getDefaultDatabaseName() + "%'";

            jdbcTemplate.queryForList(selectAllOrganizationsDbNamesQuery, String.class)
                        .forEach(this::performInitialMigrations);
        } catch (DataAccessException e) {
            log.error("Error handle migrations: {}", e.getMessage());
        }
    }

    public void performInitialMigrations(String dbName) {
        log.debug("====== Выполняем миграции для БД: [{}] ======", dbName);

        // Устанавливаем расширения
        try (HikariDataSource dsForPublicSchema =
                     datasourceFactory.getNotPoolableDataSource(dbName, INITIAL_SCHEMA_NAME)) {
            JdbcTemplate jdbcTemplate = new JdbcTemplate(dsForPublicSchema);

            log.debug("====== Устанавливаем расширения ======");
            jdbcTemplate.execute("CREATE EXTENSION IF NOT EXISTS postgis");
            jdbcTemplate.execute("CREATE EXTENSION IF NOT EXISTS pg_stat_statements");
            jdbcTemplate.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm");

            log.debug("====== Создаем служебную схему '{}' ======", SYSTEM_SCHEMA_NAME);
            jdbcTemplate.execute("CREATE SCHEMA IF NOT EXISTS " + SYSTEM_SCHEMA_NAME);
        } catch (Exception e) {
            String msg = "Не удалось установить расширения для базы: 'dbName'. \nПо причине: " + e.getMessage();

            throw new DataServiceException(msg);
        }

        try (HikariDataSource tempDataSource = datasourceFactory.getNotPoolableSystemDataSource(dbName)) {
            try (final Connection connection = tempDataSource.getConnection()) {
                log.debug("====== Выполняем основные миграции ======");
                Arrays.stream(ctx.getResources("classpath:sql/common/**"))
                      .filter(resource -> isFile(resource.getFilename()))
                      .sorted(bySequenceNumber())
                      .forEach(resource -> executeMigration(connection, resource));

                log.debug("====== Выполняем 'особенные' миграции ======");
                ScriptUtils.executeSqlScript(
                        connection,
                        new EncodedResource(ctx.getResource("classpath:sql/createFunctionForFts.sql")),
                        false,
                        false,
                        ScriptUtils.DEFAULT_COMMENT_PREFIX,
                        ";;",
                        ScriptUtils.DEFAULT_BLOCK_COMMENT_START_DELIMITER,
                        ScriptUtils.DEFAULT_BLOCK_COMMENT_END_DELIMITER);

                log.debug("====== Выполняем миграции схем ======");
                Arrays.stream(ctx.getResources("classpath:sql/schemas/**"))
                      .filter(resource -> isFile(resource.getFilename()))
                      .forEach(resource -> executeMigration(connection, resource));

                log.debug("====== Выполняем временные миграции ======");
                ScriptUtils.executeSqlScript(connection, ctx.getResource("classpath:sql/temp.sql"));
            }

            if (initFullTextSearch) {
                log.debug("====== FTS: [ Для всех таблиц включаем полнотекстовый поиск ]");
                initFtsForAll(tempDataSource);
            }
        } catch (Exception e) {
            String msg = String.format("Не удалось выполнить миграции в полном объеме для базы данных: '%s' " +
                                               "\nПо причине: %s", dbName, e.getMessage());

            throw new DataServiceException(msg);
        }
    }

    private void initFtsForAll(HikariDataSource dataSource) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);

        initForLibraries(jdbcTemplate);
        initForLayers(jdbcTemplate);
    }

    private void initForLayers(JdbcTemplate jdbcTemplate) {
        String query = "SELECT * FROM data.schemas_and_tables WHERE is_folder = false " +
                "AND (ready_for_fts ISNULL OR ready_for_fts = false)";
        List<SchemasAndTables> layers = jdbcTemplate.query(query,
                                                           new RowMapperResultSetExtractor<>(
                                                                   new SchemasAndTablesMapper()
                                                           ));
        if (layers == null) {
            return;
        }

        log.debug("====== FTS: [ Найдено: {} слоёв(я) НЕ подключенных к полнотекстовому поиску ]", layers.size());

        layers.forEach(layer -> initFtsForTable(jdbcTemplate, layer));
    }

    private void initFtsForTable(JdbcTemplate jdbcTemplate, SchemasAndTables table) {
        if (table.getSchema() == null) {
            log.error("Для таблицы: {} не определена схема", table.getId());

            return;
        }

        String tableName = table.getIdentifier();
        Long parentId = getParentId(table.getPath());
        String getParentById = "SELECT * FROM data.schemas_and_tables WHERE id = " + parentId;
        List<SchemasAndTables> result = jdbcTemplate.query(getParentById,
                                                           new RowMapperResultSetExtractor<>(
                                                                   new SchemasAndTablesMapper()
                                                           ));
        if (result == null || result.isEmpty()) {
            log.error("Не удалось найти набор данных по id: {}", parentId);

            return;
        }

        DdlTriggers ddlTriggers = new DdlTriggers(jdbcTemplate);
        SchemaDto schema = jsonToDto(table.getSchema());
        if (schema == null) {
            log.warn("Для библиотеки: {} не определена схема", table.getId());

            return;
        }

        List<String> ftsProperties = getFtsProperties(schema);
        ResourceQualifier qualifier = new ResourceQualifier(result.get(0).getIdentifier(), tableName);

        try {
            log.debug("====== FTS: [ Добавляем слой: '{}' к полнотекстовому поиску ]", tableName);

            ddlTriggers.createInsertTrigger(qualifier, ftsProperties);
            ddlTriggers.createUpdateTrigger(qualifier, ftsProperties);
            ddlTriggers.createDeleteTrigger(qualifier);
        } catch (Exception e) {
            log.error("Не удалось создать триггеры для слоя: '{}'. По причине: {}",
                      tableName, e.getMessage(), e);

            return;
        }

        try {
            jdbcTemplate.update(buildCopyDataToFtsLayersQuery(qualifier, ftsProperties));
            jdbcTemplate.update(
                    "UPDATE data.schemas_and_tables SET ready_for_fts = true WHERE identifier = '" + tableName + "'");
        } catch (Exception e) {
            log.error("Не удалось перенести данные из библиотеки: '{}'. По причине: {}",
                      tableName, e.getMessage(), e);

            ddlTriggers.dropInsertTrigger(qualifier);
            ddlTriggers.dropUpdateTrigger(qualifier);
            ddlTriggers.dropDeleteTrigger(qualifier);
        }
    }

    private void initForLibraries(JdbcTemplate jdbcTemplate) {
        String query = "SELECT * FROM data.doc_libraries WHERE ready_for_fts ISNULL OR ready_for_fts = false";
        List<DocumentLibrary> libraries = jdbcTemplate.query(query,
                                                             new RowMapperResultSetExtractor<>(
                                                                     new DocLibraryMapper()
                                                             ));
        if (libraries == null) {
            return;
        }

        log.debug("====== FTS: [ Найдено: {} библиотек НЕ подключенных к полнотекстовому поиску ]", libraries.size());

        libraries.forEach(library -> initFtsForLibrary(jdbcTemplate, library));
    }

    private void initFtsForLibrary(JdbcTemplate jdbcTemplate, DocumentLibrary library) {
        if (library.getSchema() == null) {
            log.warn("Для библиотеки: {} не определена схема", library.getId());

            return;
        }

        SchemaDto schema = jsonToDto(library.getSchema());
        if (schema == null) {
            log.warn("Для библиотеки: {} не определена схема", library.getId());

            return;
        }

        List<String> ftsProperties = getFtsProperties(schema);

        String tableName = library.getTableName();
        DdlTriggers ddlTriggers = new DdlTriggers(jdbcTemplate);
        ResourceQualifier qualifier = libraryQualifier(tableName);

        try {
            log.debug("====== FTS: [ Добавляем библиотеку: '{}' к полнотекстовому поиску ]", tableName);

            ddlTriggers.createInsertTrigger(qualifier, ftsProperties);
            ddlTriggers.createUpdateTrigger(qualifier, ftsProperties);
            ddlTriggers.createDeleteTrigger(qualifier);
        } catch (Exception e) {
            log.error("Не удалось создать триггеры для библиотеки: '{}'. По причине: {}",
                      tableName, e.getMessage(), e);

            return;
        }

        try {
            jdbcTemplate.update(buildCopyDataToFtsLayersQuery(qualifier, ftsProperties));
            jdbcTemplate.update(
                    "UPDATE data.doc_libraries SET ready_for_fts = true WHERE table_name = '" + tableName + "'");
        } catch (Exception e) {
            log.error("Не удалось перенести данные из библиотеки: '{}'. По причине: {}",
                      tableName, e.getMessage(), e);

            ddlTriggers.dropInsertTrigger(qualifier);
            ddlTriggers.dropUpdateTrigger(qualifier);
            ddlTriggers.dropDeleteTrigger(qualifier);
        }
    }

    private static Comparator<Resource> bySequenceNumber() {
        return Comparator.comparingInt(resource -> {
            String fileName = resource.getFilename();
            String numberAsString = fileName.split("__")[0].replace("M", "");

            return numberAsString.isBlank()
                    ? 0
                    : Integer.parseInt(numberAsString);
        });
    }

    private void executeMigration(Connection connection, Resource resource) {
        try {
            String sqlContent = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
            String processedSql = replacePlaceholders(sqlContent);

            // Создаем EncodedResource из обработанной строки SQL
            ByteArrayInputStream inputStream = new ByteArrayInputStream(processedSql.getBytes(StandardCharsets.UTF_8));
            EncodedResource encodedResource = new EncodedResource(new InputStreamResource(inputStream),
                                                                  StandardCharsets.UTF_8);

            ScriptUtils.executeSqlScript(connection, encodedResource);
        } catch (Exception e) {
            String msg = String.format("Не удалось развернуть миграции из файла: '%s'. \nПо причине: %s",
                                       resource.getFilename(), e.getMessage());

            throw new DataServiceException(msg);
        }
    }

    private String replacePlaceholders(String sqlContent) {
        Map<String, String> placeholders = Map.of("db_owner", dbOwner);

        String result = sqlContent;
        for (Map.Entry<String, String> entry: placeholders.entrySet()) {
            String placeholder = "${" + entry.getKey() + "}";
            result = result.replace(placeholder, entry.getValue());
        }

        return result;
    }

    private boolean isFile(String fileName) {
        return fileName != null && !fileName.isBlank();
    }
}
