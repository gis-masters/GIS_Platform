package ru.mycrg.data_service.dao.config;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import javax.annotation.Nullable;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@Service
public class DatasourceFactory {

    private static final Logger log = LoggerFactory.getLogger(DatasourceFactory.class);

    public static final String SYSTEM_SCHEMA_NAME = "data";
    public static final String INITIAL_SCHEMA_NAME = "public";
    public static final String INITIAL_DB_NAME = "crg_data_service";

    private static final int HIKARI_POOL_SIZE = 2;

    private final Map<String, HikariDataSource> dataSources = new HashMap<>();

    @Autowired
    Environment environment;

    public HikariDataSource getNotPoolableDataSource(String dbName, String schemaName) {
        return getDataSource(dbName, schemaName, 1);
    }

    public synchronized HikariDataSource getDataSource(String dbName) {
        return getNamedDataSource(dbName, null, HIKARI_POOL_SIZE);
    }

    public synchronized HikariDataSource getNamedDataSource(String dbName, @Nullable String datasourceId,
                                                            int poolSize) {
        String datasourceName = buildDatasourceKey(dbName, datasourceId);
        log.trace("getDataSource for: {}", datasourceName);

        if (dataSources.containsKey(datasourceName)) {
            log.trace("get from pool");

            return dataSources.get(datasourceName);
        } else {
            HikariDataSource dataSource = getDataSource(dbName, SYSTEM_SCHEMA_NAME, poolSize);

            dataSources.put(datasourceName, dataSource);
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

    public void closeDatasource(String dbName, String datasourceId) {
        String key = buildDatasourceKey(dbName, datasourceId);
        HikariDataSource datasource = dataSources.get(key);
        if (datasource != null) {
            dataSources.remove(key);
            datasource.close();
            log.info("Закрыт datasource " + key);
        }
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

    private String buildDatasourceKey(String dbName, @Nullable String datasourceId) {
        return datasourceId == null ? dbName : datasourceId + dbName;
    }
}
