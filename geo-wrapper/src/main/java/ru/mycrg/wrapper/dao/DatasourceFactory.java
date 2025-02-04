package ru.mycrg.wrapper.dao;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
public class DatasourceFactory {

    private final Logger log = LoggerFactory.getLogger(DatasourceFactory.class);

    private final Map<String, HikariDataSource> dataSources = new HashMap<>();

    private final Environment environment;
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public DatasourceFactory(Environment environment, JdbcTemplate jdbcTemplate) {
        this.environment = environment;
        this.jdbcTemplate = jdbcTemplate;
    }

    public JdbcTemplate getInitialJdbcTemplate() {
        return jdbcTemplate;
    }

    public JdbcTemplate getJdbcTemplate(final String dbName) {
        return new JdbcTemplate(getDatasource(dbName));
    }

    public void removeDatasourceByDbName(String name) {
        log.debug("Remove datasource for DB: {}", name);

        HikariDataSource dataSourceByName = dataSources.get(name);

        if (dataSourceByName != null) {
            if (!dataSourceByName.isClosed()) {
                dataSourceByName.close();
            }

            dataSources.remove(name);
        }
    }

    private synchronized HikariDataSource getDatasource(String dbName) {
        log.trace("Try get datasource for DB: {}", dbName);

        if (dataSources.containsKey(dbName)) {
            log.trace("Get from pool");

            return dataSources.get(dbName);
        } else {
            log.debug("Try create new dataSource");

            HikariDataSource newDataSource = new HikariDataSource();
            newDataSource.setJdbcUrl(getConnectionUrl(dbName));
            newDataSource.setUsername(environment.getProperty("spring.datasource.username"));
            newDataSource.setPassword(environment.getProperty("spring.datasource.password"));
            newDataSource.setMaximumPoolSize(2);

            dataSources.put(dbName, newDataSource);

            return newDataSource;
        }
    }

    // jdbc:postgresql://postgis:5432/postgres
    // jdbc:postgresql://127.0.0.1:5434/postgres
    // jdbc:postgresql://any-other-service-name:5434/postgres
    private String getConnectionUrl(String dbName) {
        String result;

        String[] splitedUrl = Objects.requireNonNull(environment.getProperty("spring.datasource.url")).split("/");
        result = splitedUrl[0] + "//" + splitedUrl[2] + "/" + dbName;

        log.debug("Url to new Db: {}", result);
        return result;
    }
}
