package ru.mycrg.wrapper.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.wrapper.exceptions.CrgDaoException;

import java.text.MessageFormat;

@Service
public class CrgDaoDatabaseService implements ICrgDaoDatabase {

    private static final Logger log = LoggerFactory.getLogger(CrgDaoDatabaseService.class);

    private final DatasourceFactory datasourceFactory;

    public CrgDaoDatabaseService(DatasourceFactory datasourceFactory) {
        this.datasourceFactory = datasourceFactory;
    }

    /**
     * Создаем БД с расширением PostGis <br>
     * (CREATE DATABASE cannot run inside a transaction block)
     *
     * @param dbName Название БД
     * @throws CrgDaoException
     */
    @Override
    public void createDb(final String dbName) throws CrgDaoException {
        try {
            log.debug("Try create db: {}", dbName);

            JdbcTemplate jdbcTemplate = datasourceFactory.getInitialJdbcTemplate();
            jdbcTemplate.execute(MessageFormat.format("CREATE DATABASE {0} " +
                    "WITH OWNER=fiz ENCODING='UTF8' " +
                    "TABLESPACE=pg_default CONNECTION LIMIT=-1 TEMPLATE template0;", dbName));
            jdbcTemplate.execute(MessageFormat.format("GRANT ALL ON DATABASE {0} TO fiz;", dbName));

            // Подсоединяемся к только что созданной БД и создаем расширние postgis
            JdbcTemplate newDbJdbcTemplate = datasourceFactory.getJdbcTemplate(dbName);

            newDbJdbcTemplate.execute("CREATE EXTENSION postgis;");

            datasourceFactory.removeDatasourceByDbName(dbName);
        } catch (Exception e) {
            throw new CrgDaoException("Не удалось создать организацию: " + dbName, e.getCause());
        }
    }

}
