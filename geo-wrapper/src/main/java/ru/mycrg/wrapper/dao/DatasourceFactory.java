package ru.mycrg.wrapper.dao;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
public class DatasourceFactory {

    private static final Logger log = LoggerFactory.getLogger(DatasourceFactory.class);

    private Map<String, HikariDataSource> dataSources = new HashMap<>();

    private final Environment environment;

    @Autowired
    public DatasourceFactory(Environment environment) {
        this.environment = environment;
    }

    public HikariDataSource getDatasource(String dbName) {
        log.debug("Try get datasource for DB: {}", dbName);

        if (dataSources.containsKey(dbName)) {
            log.debug("Get from pool");

            return dataSources.get(dbName);
        } else {
            log.debug("Try create new dataSource");

            HikariDataSource newDataSource = new HikariDataSource();
            newDataSource.setJdbcUrl(getConnectionUrl(dbName));
            newDataSource.setUsername(environment.getProperty("spring.datasource.username"));
            newDataSource.setPassword(environment.getProperty("spring.datasource.password"));
            newDataSource.setMaximumPoolSize(5);

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
