package ru.mycrg.data_service.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.TableIdentifier;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SchemasDDL {

    private static final Logger log = LoggerFactory.getLogger(SchemasDDL.class);

    private final List<String> systemSchemas = List.of("data");
    private final String EXTENSION_POSTFIX = "_extension";

    private final Environment environment;
    private final JdbcTemplate jdbcTemplate;

    public SchemasDDL(JdbcTemplate jdbcTemplate,
                      Environment environment) {
        this.environment = environment;
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Возвращает все схемы за исключением служебных {@link #systemSchemas}
     * @return список названий схемм
     */
    public List<String> getAll() {
        final String dbOwner = environment.getRequiredProperty("spring.datasource.username");

        String sql = "SELECT schema_name FROM information_schema.schemata " +
                "WHERE schema_owner = '" + dbOwner + "'";

        try {
            return jdbcTemplate.queryForList(sql, String.class).stream()
                               .filter(name -> !systemSchemas.contains(name))
                               .collect(Collectors.toList());
        } catch (DataAccessException e) {
            final String msg = "Get schemas failed: " + e.getMessage();
            log.error(msg);

            throw new DataServiceException(msg);
        }
    }

    /**
     * Находит все таблицы заданной схемы исключая служебные. <br>
     * Служебными считаются таблицы с постфиксом {@link #EXTENSION_POSTFIX}
     * @param schemaName Название схемы
     * @return Список идентификаторов таблиц в виде "schemaName:tableName"
     */
    public List<String> getTables(String schemaName) {
        String sql = "SELECT table_name FROM information_schema.tables " +
                "WHERE table_schema = '" + schemaName + "' AND table_type = 'BASE TABLE'";

        try {
            return jdbcTemplate
                    .queryForList(sql, String.class).stream()
                    .filter(tableName -> !tableName.contains(EXTENSION_POSTFIX))
                    .map(tableName -> new TableIdentifier(schemaName, tableName).toString())
                    .collect(Collectors.toList());
        } catch (DataAccessException e) {
            final String msg = "Get tables from schema: " + schemaName + " failed: " + e.getMessage();
            log.error(msg);

            throw new DataServiceException(msg);
        }
    }

    public Long countTables(String schemaName) {
        String sql = "SELECT count(*) FROM information_schema.tables " +
                "WHERE table_schema = '" + schemaName + "' AND table_type = 'BASE TABLE'";

        try {
            return jdbcTemplate.queryForObject(sql, Long.class);
        } catch (DataAccessException e) {
            final String msg = "Count tables in schema: " + schemaName + " failed: " + e.getMessage();
            log.error(msg);

            throw new DataServiceException(msg);
        }
    }

    public boolean isSchemaExist(String schemaName) {
        if (systemSchemas.contains(schemaName)) {
            log.info("try use system schema: {}", schemaName);

            return false;
        }

        String sql = "SELECT EXISTS(SELECT 1 FROM pg_namespace WHERE nspname = '" + schemaName + "')";

        try {
            return jdbcTemplate.queryForObject(sql, Boolean.class);
        } catch (DataAccessException e) {
            log.warn("Check schema: {} failed: {}", schemaName, e.getMessage());

            return false;
        }
    }
}
