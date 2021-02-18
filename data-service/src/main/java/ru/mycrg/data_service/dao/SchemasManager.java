package ru.mycrg.data_service.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;
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
    public void create(ResourceIdentifier rIdentifier) {
        final String dbOwner = environment.getRequiredProperty("spring.datasource.username");
        try {
            log.debug("Создание схемы {}", rIdentifier.getId());

            jdbcTemplate.execute("CREATE SCHEMA IF NOT EXISTS " + rIdentifier.getId() + "; " +
                                         "ALTER SCHEMA " + rIdentifier.getId() + " OWNER TO " + dbOwner);
        } catch (DataAccessException e) {
            String msg = "Не удалось создать схему: " + rIdentifier.getId();

            log.error(msg);

            throw new DataServiceException(msg, e.getCause());
        }
    }

    @Override
    public boolean isExist(ResourceIdentifier rIdentifier) {
        if (systemSchemas.contains(rIdentifier.getId())) {
            log.info("try use system schema: {}", rIdentifier.getId());

            return true;
        }

        String sql = "SELECT EXISTS(SELECT 1 FROM pg_namespace WHERE nspname = '" + rIdentifier.getId() + "')";

        try {
            return jdbcTemplate.queryForObject(sql, Boolean.class);
        } catch (DataAccessException e) {
            final String msg = "Check schema: " + rIdentifier.getId() + " failed: " + e.getMessage();
            log.error(msg);

            throw new DataServiceException(msg, e.getCause());
        }
    }

    @Override
    public void delete(ResourceIdentifier rIdentifier) {
        try {
            log.debug("Удаление схемы {}", rIdentifier.getId());

            jdbcTemplate.execute("DROP SCHEMA IF EXISTS " + rIdentifier.getId() + " CASCADE");
        } catch (DataAccessException e) {
            String msg = "Не удалось удалить схему: " + rIdentifier.getId();

            log.error(msg);

            throw new DataServiceException(msg, e.getCause());
        }
    }
}
