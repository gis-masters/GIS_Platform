package ru.mycrg.wrapper.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.SQLException;
import java.text.MessageFormat;

@Service
public class CrgDatabaseService implements ICrgDatabase {

    private static final Logger log = LoggerFactory.getLogger(CrgDatabaseService.class);

    private final DatasourceFactory datasourceFactory;

    public CrgDatabaseService(DatasourceFactory datasourceFactory) {
        this.datasourceFactory = datasourceFactory;
    }

    /**
     * Создаем БД с расширением PostGis <br>
     * (CREATE DATABASE cannot run inside a transaction block)
     *
     * @param dbName Название БД
     * @throws RuntimeException
     */
    @Override
    public void createDb(final String dbName) throws RuntimeException, SQLException {
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
    }

}
