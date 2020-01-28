package ru.mycrg.wrapper.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.wrapper.exceptions.DaoException;

@Service
public class CrgDaoSchemas {

    private static final Logger log = LoggerFactory.getLogger(CrgDaoSchemas.class);

    private final DatasourceFactory dataSourceFactory;

    public CrgDaoSchemas(DatasourceFactory dataSourceFactory) {
        this.dataSourceFactory = dataSourceFactory;
    }

    public void create(JdbcTemplate jdbcTemplate, String schemaName) throws DaoException {
        try {
            log.debug("Создание схемы {}", schemaName);

            jdbcTemplate.execute("CREATE SCHEMA IF NOT EXISTS " + schemaName + "; " +
                                 "ALTER SCHEMA " + schemaName + " OWNER TO fiz;");
        } catch (Exception e) {
            String msg = "Не удалось создать схему: " + schemaName;

            log.error(msg, e);

            throw new DaoException(msg, e.getCause());
        }
    }

    /**
     * Удаление схемы
     */
    public void delete(String dbName, String schemaName) throws DaoException {
        try {
            log.debug("Удаление схемы {} Для БД: {}", schemaName, dbName);

            dataSourceFactory
                    .getJdbcTemplate(dbName)
                    .execute("DROP SCHEMA IF EXISTS " + schemaName + " CASCADE;");
        } catch (Exception e) {
            String msg = "Не удалось удалить схему: " + schemaName;

            log.error(msg, e);

            throw new DaoException(msg, e.getCause());
        }
    }

}
