package ru.mycrg.data_service.dao.migrations;

import com.google.gson.Gson;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.EncodedResource;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.dao.ddl.tables.DdlTriggers;
import ru.mycrg.data_service.dao.mappers.DocLibraryMapper;
import ru.mycrg.data_service.dao.mappers.SchemaMapper;
import ru.mycrg.data_service.entity.DocumentLibrary;
import ru.mycrg.data_service.entity.Schema;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.sql.Connection;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.INITIAL_SCHEMA_NAME;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildCopyDataToFtsLayersQuery;
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
            jdbcTemplate.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm");

            log.debug("====== Создаем служебную схему '{}' ======", SYSTEM_SCHEMA_NAME);
            jdbcTemplate.execute("CREATE SCHEMA IF NOT EXISTS " + SYSTEM_SCHEMA_NAME);
        } catch (Exception e) {
            log.error("Не удалось установить расширения для базы: {} По причине: {}", dbName, e.getMessage());
        }

        try (HikariDataSource tempDataSource = datasourceFactory.getNotPoolableDataSource(dbName, SYSTEM_SCHEMA_NAME)) {
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
            log.error("Не удалось выполнить миграции в полном объеме для базы данных: {} По причине: {}",
                      dbName, e.getMessage());
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
                                                                   new BeanPropertyRowMapper<>(SchemasAndTables.class)
                                                           ));
        if (layers == null) {
            return;
        }

        log.debug("====== FTS: [ Найдено: {} слоёв(я) НЕ подключенных к полнотекстовому поиску ]", layers.size());

        layers.forEach(layer -> initFtsForLayer(jdbcTemplate, layer));
    }

    private void initFtsForLayer(JdbcTemplate jdbcTemplate, SchemasAndTables layer) {
        Optional<Schema> oSchema = getSchema(jdbcTemplate, layer.getSchemaId());
        if (oSchema.isEmpty()) {
            log.error("Не удалось найти схему: '{}'", layer.getSchemaId());

            return;
        }

        String tableName = layer.getIdentifier();
        Long parentId = getParentId(layer.getPath());
        String getParentById = "SELECT * FROM data.schemas_and_tables WHERE id = " + parentId;
        List<SchemasAndTables> result = jdbcTemplate.query(getParentById,
                                                           new RowMapperResultSetExtractor<>(
                                                                   new BeanPropertyRowMapper<>(SchemasAndTables.class)
                                                           ));
        if (result == null || result.isEmpty()) {
            log.error("Не удалось найти набор данных по id: {}", parentId);

            return;
        }

        DdlTriggers ddlTriggers = new DdlTriggers(jdbcTemplate);
        List<String> ftsProperties = getFtsProperties(mapToSchemaDto(oSchema.get()));
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
        Optional<Schema> oSchema = getSchema(jdbcTemplate, library.getSchemaId());
        if (oSchema.isEmpty()) {
            return;
        }

        List<String> ftsProperties = getFtsProperties(mapToSchemaDto(oSchema.get()));

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

    private Optional<Schema> getSchema(JdbcTemplate jdbcTemplate, String schemaId) {
        String selectSchemaByNameQuery = "SELECT * FROM data.schemas WHERE name = '" + schemaId + "'";

        List<Schema> schemas = jdbcTemplate.query(selectSchemaByNameQuery, new RowMapperResultSetExtractor<>(
                new SchemaMapper()
        ));

        if (schemas == null || schemas.isEmpty()) {
            return Optional.empty();
        }

        return Optional.ofNullable(schemas.get(0));
    }

    private SchemaDto mapToSchemaDto(Schema schema) {
        return new Gson().fromJson(schema.getClassRule().textValue(), SchemaDto.class);
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
            ScriptUtils.executeSqlScript(connection, resource);
        } catch (Exception e) {
            log.warn("Не удалось развернуть миграции из файла: '{}'\n По причине: {}",
                     resource.getFilename(), e.getMessage(), e.getCause());
        }
    }

    private boolean isFile(String fileName) {
        return fileName != null && !fileName.isBlank();
    }
}
