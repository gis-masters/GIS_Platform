package ru.mycrg.wrapper.dao;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.MessageFormat;
import java.util.List;
import java.util.Map;

@Service
public class PostGisStorage {

    private static final Logger log = LoggerFactory.getLogger(PostGisStorage.class);

    private final JdbcTemplate jdbcTemplate;

    private final Environment environment;

    private HikariDataSource dataSource;

    @Autowired
    public PostGisStorage(JdbcTemplate jdbcTemplate, Environment environment) {
        this.environment = environment;
        this.jdbcTemplate = jdbcTemplate;
    }

    public void createDb(final String dbName) throws RuntimeException {
        log.info("Try create db: {}", dbName);

        jdbcTemplate.execute(MessageFormat.format("CREATE DATABASE {0};", dbName));
        jdbcTemplate.execute(MessageFormat.format("GRANT ALL ON DATABASE {0} TO fiz;", dbName));

        createExtensionForNewDb(dbName);
    }

    public void getFromTable(final String dbName, final String schema, final String tableName) {
        log.info(" --- {} / {} / {}", dbName, schema, tableName);

//        try (Statement statement = getConnection(dbName).createStatement()) {
//            statement.setFetchSize(50);
//
//            ResultSet resultSet = statement.executeQuery("SELECT * FROM " + schema + "." + tableName);
//            while (resultSet.next()) {
//                log.info("# {}: {}", resultSet.getRow(), resultSet.getString("classid"));
//            }
//
//            log.info(" --- {}", resultSet.getFetchSize());

        try (HikariDataSource datasource = getDatasource(dbName)) {
            JdbcTemplate jdbcTemplate = new JdbcTemplate(datasource);
            jdbcTemplate.setFetchSize(50);

            List<Map<String, Object>> list = jdbcTemplate.queryForList("SELECT * FROM " + schema + "." + tableName);

            log.info(" --- {}", list.size());
        } catch (RuntimeException e) {
            log.error("Failed get rows: {}", e.getLocalizedMessage());

            throw new RuntimeException("Failed get rows: " + e.getLocalizedMessage());
        } finally {
            // dataSource.close();
        }

        log.info("Successfully {}", "!!!");
    }

//    public Map<String, Object> getFromTable(final String tableName) throws RuntimeException {
//        log.info("getAllFromTable: {}", tableName);
//
//        jdbcTemplate.setFetchSize(50);
//
//        Map<String, Object> result = jdbcTemplate.queryForMap("SELECT * FROM " + tableName);
//
//        return result;
//    }

    private void createExtensionForNewDb(final String dbName) {
        try (HikariDataSource datasource = getDatasource(dbName)) {
            JdbcTemplate jdbcTemplate = new JdbcTemplate(datasource);
            jdbcTemplate.execute("CREATE EXTENSION postgis;");
        } catch (RuntimeException e) {
            log.warn("Failed create extension: {}", e.getLocalizedMessage());
        }

        log.info("Successfully created");
    }

    // jdbc:postgresql://postgis:5432/postgres
    // jdbc:postgresql://127.0.0.1:5434/postgres
    // jdbc:postgresql://any-other-service-name:5434/postgres

    private String getConnectionUrl(String dbName) {
        String result;

        String[] splitedUrl = environment.getProperty("spring.datasource.url").split("/");
        result = splitedUrl[0] + "//" + splitedUrl[2] + "/" + dbName;

        log.info("Url to new Db: {}", result);
        return result;
    }
    private Connection getConnection(String dbName) {
        dataSource = getDatasource(dbName);
        Connection connection = null;
        try {
            connection = dataSource.getConnection();
        } catch (SQLException e) {
            log.error("Failed get connection: {}", e.getLocalizedMessage());

            throw new RuntimeException("Failed get connection: " + e.getLocalizedMessage());
        }

        return connection;
    }

    private HikariDataSource getDatasource(String dbName) {
        HikariDataSource newDataSource = new HikariDataSource();
        newDataSource.setJdbcUrl(getConnectionUrl(dbName));
        newDataSource.setUsername(environment.getProperty("spring.datasource.username"));
        newDataSource.setPassword(environment.getProperty("spring.datasource.password"));
        newDataSource.setMaximumPoolSize(1);

        return newDataSource;
    }

}
