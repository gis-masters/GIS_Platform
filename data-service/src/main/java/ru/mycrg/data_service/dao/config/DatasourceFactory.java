package ru.mycrg.data_service.dao.config;

import com.zaxxer.hikari.HikariDataSource;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import javax.annotation.Nullable;
import javax.sql.DataSource;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@Service
public class DatasourceFactory {

    private static final Logger log = LoggerFactory.getLogger(DatasourceFactory.class);

    public static final String SYSTEM_SCHEMA_NAME = "data";
    public static final String INITIAL_SCHEMA_NAME = "public";
    public static final String INITIAL_DB_NAME = "crg_data_service";

    @Value("${spring.datasource.hikari.minimum-pool-size:2}")
    private int MINIMAL_POOL;
    
    @Value("${spring.datasource.hikari.maximum-pool-size:10}")
    private int DEFAULT_POOL;

    private final Map<String, HikariDataSource> dataSources = new HashMap<>();

    @Autowired
    Environment environment;

    public HikariDataSource getNotPoolableDataSource(String dbName, String schemaName) {
        return getDataSourceByDbName(dbName, schemaName, MINIMAL_POOL);
    }

    public HikariDataSource getNotPoolableSystemDataSource(String dbName) {
        return getDataSourceByDbName(dbName, SYSTEM_SCHEMA_NAME, MINIMAL_POOL);
    }

    public DataSource getInitialDataSource() {
        return getDataSourceByUrl(environment.getProperty("spring.datasource.url"),
                                  null,
                                  MINIMAL_POOL);
    }

    public synchronized HikariDataSource getDataSource(String dbName) {
        return (HikariDataSource) getNamedDataSource(dbName, null, MINIMAL_POOL);
    }

    public synchronized DataSource getNamedDataSource(String dbName, @Nullable String datasourceId) {
        return getNamedDataSource(dbName, datasourceId, DEFAULT_POOL);
    }

    public void closeDatasource(String dbName, String datasourceId) {
        String key = buildDatasourceKey(dbName, datasourceId);
        HikariDataSource datasource = dataSources.get(key);
        if (datasource != null) {
            dataSources.remove(key);
            datasource.close();
            log.info("Закрыт datasource: {}", key);
        }
    }

    private HikariDataSource getDataSourceByDbName(String dbName, String schemaName, int poolSize) {
        String envUri = environment.getRequiredProperty("spring.datasource.url");
        String source = "jdbc:";

        URI defaultUri = URI.create(envUri.substring(source.length()));

        String url = String.format("%s%s://%s:%d/%s",
                                   source, defaultUri.getScheme(), defaultUri.getHost(), defaultUri.getPort(), dbName);

        return getDataSourceByUrl(url, schemaName, poolSize);
    }

    @NotNull
    private HikariDataSource getDataSourceByUrl(String url,
                                                @Nullable String schemaName,
                                                int poolSize) {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setDriverClassName("org.postgresql.Driver");
        dataSource.setJdbcUrl(url);
        dataSource.setUsername(environment.getRequiredProperty("spring.datasource.username"));
        dataSource.setPassword(environment.getRequiredProperty("spring.datasource.password"));
        dataSource.setMaximumPoolSize(poolSize);

        if (schemaName != null) {
            dataSource.setSchema(schemaName);
        }

        return dataSource;
    }

    private synchronized DataSource getNamedDataSource(String dbName,
                                                       @Nullable String datasourceId,
                                                       int poolSize) {
        String datasourceName = buildDatasourceKey(dbName, datasourceId);
        log.trace("getDataSource for: {}", datasourceName);

        if (dataSources.containsKey(datasourceName)) {
            log.trace("get from pool");

            return dataSources.get(datasourceName);
        } else {
            HikariDataSource dataSource = getDataSourceByDbName(dbName, SYSTEM_SCHEMA_NAME, poolSize);

            dataSources.put(datasourceName, dataSource);
            log.debug("Created new one. Current pool size: {}", dataSources.size());

            return dataSource;
        }
    }

    private String buildDatasourceKey(String dbName, @Nullable String datasourceId) {
        return datasourceId == null ? dbName : datasourceId + dbName;
    }
}
