package ru.mycrg.wrapper.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import ru.mycrg.wrapper.exceptions.DaoException;

@Service
public class CrgDaoSchemaService extends BaseDaoService implements ICrgDaoSchema {

    private static final Logger log = LoggerFactory.getLogger(CrgDaoSchemaService.class);

    public CrgDaoSchemaService(DatasourceFactory datasourceFactory, ResourceLoader resourceLoader) {
        super(datasourceFactory, resourceLoader);
    }

    /**
     * Создание схемы
     */
    public void create(String dbName, String schemaName) throws DaoException {
        try {
            log.debug("Создание схемы {} Для БД: {}", schemaName, dbName);

            datasourceFactory
                    .getJdbcTemplate(dbName)
                    .execute("CREATE SCHEMA " + schemaName + "; ALTER SCHEMA " + schemaName + " OWNER TO fiz;");
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

            datasourceFactory
                    .getJdbcTemplate(dbName)
                    .execute("DROP SCHEMA IF EXISTS " + schemaName + " CASCADE;");
        } catch (Exception e) {
            String msg = "Не удалось удалить схему: " + schemaName;

            log.error(msg, e);

            throw new DaoException(msg, e.getCause());
        }
    }

}
