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
public class CrgDatabaseService extends BaseDaoService implements ICrgDatabase {

    private static final Logger log = LoggerFactory.getLogger(CrgDatabaseService.class);

    public CrgDatabaseService(DatasourceFactory datasourceFactory, ResourceLoader resourceLoader) {
        super(datasourceFactory, resourceLoader);
    }

    /**
     * Создаем БД с расширением PostGis и схемой данных ФГИСТП 10 приказ (по-умолчанию) <br>
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
        Connection newDbConnection = datasourceFactory.getDatasource(dbName).getConnection();
        JdbcTemplate newDbJdbcTemplate = datasourceFactory.getJdbcTemplate(dbName);

        newDbJdbcTemplate.execute("CREATE EXTENSION postgis;");

        Resource schemaFile = resourceLoader.getResource("classpath:db/schemaP10.sql");
        Resource dataFile = resourceLoader.getResource("classpath:db/schemaP10Data.sql");

        // Create schema
        ScriptUtils.executeSqlScript(newDbConnection, schemaFile);

        // Insert data
        ScriptUtils.executeSqlScript(newDbConnection, dataFile);

        datasourceFactory.removeDatasourceByDbName(dbName);
    }

}
