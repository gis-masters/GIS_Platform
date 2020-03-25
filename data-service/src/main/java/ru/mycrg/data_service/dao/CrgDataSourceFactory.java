package ru.mycrg.data_service.dao;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
public class CrgDataSourceFactory {

    private static final Logger log = LoggerFactory.getLogger(CrgDataSourceFactory.class);

    private Map<String, HikariDataSource> dataSources = new HashMap<>();

    private final Environment environment;
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public CrgDataSourceFactory(Environment environment, JdbcTemplate jdbcTemplate) {
        this.environment = environment;
        this.jdbcTemplate = jdbcTemplate;
    }

    public HikariDataSource getDatasource(String dbName) {
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
            newDataSource.setMaximumPoolSize(3);

            dataSources.put(dbName, newDataSource);

            return newDataSource;
        }
    }

    public JdbcTemplate getInitialJdbcTemplate() {
        return jdbcTemplate;
    }

    public JdbcTemplate getJdbcTemplate(final String dbName) {
        log.trace("get new JdbcTemplate for: {}", dbName);

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

    public String getConnectionUrl(String dbName) {
        String envUri = Objects.requireNonNull(environment.getProperty("spring.datasource.url"));
        String source = "jdbc:";

        URI defaultUri = URI.create(envUri.substring(source.length()));

        return source +
                defaultUri.getScheme() + "://" +
                defaultUri.getHost() + ":" + defaultUri.getPort() +
                "/" + dbName;
    }

}
