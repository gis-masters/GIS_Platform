package ru.mycrg.data_service.dao;

import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class CrgMigrationHandler extends CrgDataSourcesPool {

    @Autowired
    private ServiceTablesInitializer serviceTablesInitializer;

    public void handle() {
        try {
            log.info("Handle migrations");

            JdbcTemplate jdbcTemplate = new JdbcTemplate(getInitialDataSource());

            String selectAllOrganizationsDb = "SELECT datname FROM pg_database WHERE datname like '" + DEFAULT_DB_NAME + "%'";

            jdbcTemplate
                    .queryForList(selectAllOrganizationsDb, String.class)
                    .forEach(this::initMigration);
        } catch (DataAccessException e) {
            log.error("Error handle migrations: {}", e.getMessage());
        }
    }

    private void initMigration(String dbName) {
        log.debug("Initialize service tables for: {}", dbName);

        HikariDataSource tempDataSource = new HikariDataSource();
        tempDataSource.setJdbcUrl(getConnectionUrl(dbName));
        tempDataSource.setSchema(DATA_SCHEMA_NAME);
        tempDataSource.setUsername(environment.getProperty("spring.datasource.username"));
        tempDataSource.setPassword(environment.getProperty("spring.datasource.password"));
        tempDataSource.setMaximumPoolSize(1);

        JdbcTemplate jdbcTemplate = new JdbcTemplate(tempDataSource);

        serviceTablesInitializer.initialize(jdbcTemplate);

        tempDataSource.close();
    }
}
