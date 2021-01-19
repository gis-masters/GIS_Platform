package ru.mycrg.data_service.dao;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@Service
public class CrgDataSourcesPool {

    public static final Logger log = LoggerFactory.getLogger(CrgDataSourcesPool.class);

    public static final String DEFAULT_DB_NAME = "database_";
    public static final String DATA_SCHEMA_NAME = "data";
    public static final String INITIAL_SCHEMA_NAME = "public";
    public static final String INITIAL_DB_NAME = "crg_data_service";

    private static final int HIKARI_POOL_SIZE = 2;

    final Map<String, HikariDataSource> dataSources = new HashMap<>();

    @Autowired
    Environment environment;

    public HikariDataSource getNotPoolableDataSource(String dbName, String schemaName) {
        return getDataSource(dbName, schemaName, 1);
    }

    public synchronized HikariDataSource getDataSource(String dbName) {
        log.debug("getDataSource for: {}", dbName);

        if (dataSources.containsKey(dbName)) {
            log.debug("get from pool");

            return dataSources.get(dbName);
        } else {
            HikariDataSource dataSource = getDataSource(dbName, DATA_SCHEMA_NAME, HIKARI_POOL_SIZE);

            dataSources.put(dbName, dataSource);
            log.debug("Created new one. Current pool size: {}", dataSources.size());

            return dataSource;
        }
    }

    public HikariDataSource getInitialDataSource() {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setDriverClassName("org.postgresql.Driver");
        dataSource.setJdbcUrl(environment.getProperty("spring.datasource.url"));
        dataSource.setUsername(getInitialUser());
        dataSource.setPassword(getInitialPassword());
        dataSource.setMaximumPoolSize(HIKARI_POOL_SIZE);

        return dataSource;
    }

    public String getInitialUser() {
        return environment.getRequiredProperty("spring.datasource.username");
    }

    public String getInitialPassword() {
        return environment.getRequiredProperty("spring.datasource.password");
    }

    private HikariDataSource getDataSource(String dbName, String schemaName, int poolSize) {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setDriverClassName("org.postgresql.Driver");
        dataSource.setJdbcUrl(getConnectionUrl(dbName));
        dataSource.setSchema(schemaName);
        dataSource.setUsername(getInitialUser());
        dataSource.setPassword(getInitialPassword());
        dataSource.setMaximumPoolSize(poolSize);

        return dataSource;
    }

    private String getConnectionUrl(String dbName) {
        String envUri = environment.getRequiredProperty("spring.datasource.url");
        String source = "jdbc:";

        URI defaultUri = URI.create(envUri.substring(source.length()));

        return source +
                defaultUri.getScheme() + "://" +
                defaultUri.getHost() + ":" + defaultUri.getPort() +
                "/" + dbName;
    }
}
