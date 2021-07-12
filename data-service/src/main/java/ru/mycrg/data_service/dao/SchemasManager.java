package ru.mycrg.data_service.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.ResourceManager;

import java.util.List;

import static ru.mycrg.data_service.dao.CrgDataSourcesPool.SYSTEM_SCHEMA_NAME;

@Service
public class SchemasManager implements ResourceManager {

    private static final Logger log = LoggerFactory.getLogger(SchemasManager.class);

    private final List<String> systemSchemas = List.of(SYSTEM_SCHEMA_NAME);

    private final Environment environment;
    private final JdbcTemplate jdbcTemplate;

    public SchemasManager(JdbcTemplate jdbcTemplate,
                          Environment environment) {
        this.environment = environment;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void create(ResourceQualifier schemaQualifier) {
        final String dbOwner = environment.getRequiredProperty("spring.datasource.username");
        try {
            log.debug("Создание схемы {}", schemaQualifier);

            jdbcTemplate.execute("CREATE SCHEMA IF NOT EXISTS " + schemaQualifier + "; " +
                                         "ALTER SCHEMA " + schemaQualifier + " OWNER TO " + dbOwner);
        } catch (DataAccessException e) {
            String msg = "Не удалось создать схему: " + schemaQualifier.getQualifier();

            log.error(msg);

            throw new DataServiceException(msg, e.getCause());
        }
    }

    @Override
    public boolean isExist(ResourceQualifier schemaQualifier) {
        try {
            if (systemSchemas.contains(schemaQualifier.getQualifier())) {
                log.info("try use system schema: {}", schemaQualifier);

                return true;
            }

            String sql = "SELECT EXISTS(SELECT 1 FROM pg_namespace WHERE nspname = '" + schemaQualifier + "')";

            final Boolean result = jdbcTemplate.queryForObject(sql, Boolean.class);

            return Boolean.TRUE.equals(result);
        } catch (DataAccessException e) {
            final String msg = "Check schema: " + schemaQualifier + " failed: " + e.getMessage();
            log.error(msg);

            throw new DataServiceException(msg, e.getCause());
        }
    }

    @Override
    public void delete(ResourceQualifier schemaQualifier) {
        try {
            log.debug("Удаление схемы {}", schemaQualifier);

            jdbcTemplate.execute("DROP SCHEMA IF EXISTS " + schemaQualifier + " CASCADE");
        } catch (DataAccessException e) {
            String msg = "Не удалось удалить схему: " + schemaQualifier;

            log.error(msg);

            throw new DataServiceException(msg, e.getCause());
        }
    }
}
