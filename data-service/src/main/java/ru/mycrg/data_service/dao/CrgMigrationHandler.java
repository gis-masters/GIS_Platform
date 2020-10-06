package ru.mycrg.data_service.dao;

import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.log4j.Log4j2;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.service.BaseMapsService;

import static ru.mycrg.data_service.dao.CrgDataSourcesPool.DATA_SCHEMA_NAME;
import static ru.mycrg.data_service.dao.CrgDataSourcesPool.DEFAULT_DB_NAME;

@Log4j2
@Service
public class CrgMigrationHandler {

    private final CrgDataSourcesPool crgDataSourcesPool;
    private final BaseMapsService baseMapsService;
    private final ServiceTablesInitializer serviceTablesInitializer;

    public CrgMigrationHandler(ServiceTablesInitializer serviceTablesInitializer,
                               CrgDataSourcesPool crgDataSourcesPool,
                               BaseMapsService baseMapsService) {
        this.baseMapsService = baseMapsService;
        this.crgDataSourcesPool = crgDataSourcesPool;
        this.serviceTablesInitializer = serviceTablesInitializer;
    }

    public void handle() {
        try {
            log.info("Handle migrations");

            JdbcTemplate jdbcTemplate = new JdbcTemplate(crgDataSourcesPool.getInitialDataSource());

            String selectAllOrganizationsDb = "SELECT datname FROM pg_database WHERE datname like '" + DEFAULT_DB_NAME + "%'";

            jdbcTemplate
                    .queryForList(selectAllOrganizationsDb, String.class)
                    .forEach(this::initMigration);
        } catch (DataAccessException e) {
            log.error("Error handle migrations: {}", e.getMessage());
        }
    }

    public void initMigration(String dbName) {
        try {
            HikariDataSource tempDataSource = crgDataSourcesPool.getNotPoolableDataSource(dbName, DATA_SCHEMA_NAME);

            JdbcTemplate jdbcTemplate = new JdbcTemplate(tempDataSource);

            serviceTablesInitializer.initialize(jdbcTemplate);
            baseMapsService.initDefault(jdbcTemplate);

            tempDataSource.close();
        } catch (Exception e) {
            log.error("Cant initialize service tables for: " + dbName, e.getMessage());
        }
    }
}
