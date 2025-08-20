package ru.mycrg.data_service.dao.ddl.schemas;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

@Service
public class DdlSchemas {

    private final Logger log = LoggerFactory.getLogger(DdlSchemas.class);

    private final Environment environment;
    private final JdbcTemplate jdbcTemplate;

    public DdlSchemas(JdbcTemplate jdbcTemplate,
                      Environment environment) {
        this.environment = environment;
        this.jdbcTemplate = jdbcTemplate;
    }

    public void create(ResourceQualifier schemaQualifier) {
        String dbOwner = environment.getRequiredProperty("spring.datasource.username");
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

    public void drop(ResourceQualifier schemaQualifier) {
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
