package ru.mycrg.data_service.dao;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
public class CrgDataSourcesPool {

    static final String DEFAULT_DB_NAME = "database_";
    static final String DATA_SCHEMA_NAME = "data";

    final Map<String, HikariDataSource> dataSources = new HashMap<>();

    @Autowired
    Environment environment;

    HikariDataSource getDataSource(String dbName) {
        if (dataSources.containsKey(dbName)) {
            return dataSources.get(dbName);
        } else {
            HikariDataSource newDataSource = new HikariDataSource();
            newDataSource.setJdbcUrl(getConnectionUrl(dbName));
            newDataSource.setSchema(DATA_SCHEMA_NAME);
            newDataSource.setUsername(environment.getProperty("spring.datasource.username"));
            newDataSource.setPassword(environment.getProperty("spring.datasource.password"));
            newDataSource.setMaximumPoolSize(3);

            dataSources.put(dbName, newDataSource);

            return newDataSource;
        }
    }

    HikariDataSource getInitialDataSource() {
        HikariDataSource newDataSource = new HikariDataSource();
        newDataSource.setJdbcUrl(environment.getProperty("spring.datasource.url"));
        newDataSource.setUsername(environment.getProperty("spring.datasource.username"));
        newDataSource.setPassword(environment.getProperty("spring.datasource.password"));
        newDataSource.setMaximumPoolSize(3);

        return newDataSource;
    }

    String getConnectionUrl(String dbName) {
        String envUri = Objects.requireNonNull(environment.getProperty("spring.datasource.url"));
        String source = "jdbc:";

        URI defaultUri = URI.create(envUri.substring(source.length()));

        return source +
                defaultUri.getScheme() + "://" +
                defaultUri.getHost() + ":" + defaultUri.getPort() +
                "/" + dbName;
    }

}
