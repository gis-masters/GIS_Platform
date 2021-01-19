package ru.mycrg.data_service.dao;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SingleColumnRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;

import static ru.mycrg.data_service.dao.CrgDataSourcesPool.INITIAL_SCHEMA_NAME;

@Service
public class DatabaseDDL {

    public static final Logger log = LoggerFactory.getLogger(DatabaseDDL.class);

    private final JdbcTemplate jdbcTemplate;
    private final CrgDataSourcesPool crgDataSourcesPool;
    private final NamedParameterJdbcTemplate parameterJdbcTemplate;

    public DatabaseDDL(JdbcTemplate jdbcTemplate,
                       CrgDataSourcesPool crgDataSourcesPool,
                       NamedParameterJdbcTemplate parameterJdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.crgDataSourcesPool = crgDataSourcesPool;
        this.parameterJdbcTemplate = parameterJdbcTemplate;
    }

    /**
     * Создаем БД с расширением PostGis <br>
     * (CREATE DATABASE cannot run inside a transaction block)
     *
     * @param dbName Название БД
     */
    public void create(final String dbName) {
        HikariDataSource newDataSource = null;
        try {
            log.debug("Try create db: {}", dbName);

            final String sql = "CREATE DATABASE " + dbName + " WITH " +
                    " OWNER = " + crgDataSourcesPool.getInitialUser() +
                    " ENCODING = 'UTF8'" +
                    " LC_COLLATE = 'en_US.UTF-8'" +
                    " LC_CTYPE = 'en_US.UTF-8'" +
                    " TABLESPACE = pg_default" +
                    " CONNECTION LIMIT = -1 " +
                    " TEMPLATE template0";

            jdbcTemplate.execute(sql);
            jdbcTemplate.execute("GRANT ALL ON DATABASE " + dbName + " TO " + crgDataSourcesPool.getInitialUser());

            // Подсоединяемся к только что созданной БД и создаем расширние postgis
            newDataSource = crgDataSourcesPool.getNotPoolableDataSource(dbName, INITIAL_SCHEMA_NAME);

            JdbcTemplate newDbJdbcTemplate = new JdbcTemplate(newDataSource);

            newDbJdbcTemplate.execute("CREATE EXTENSION postgis");
        } catch (Exception e) {
            log.error(e.toString());

            throw new DataServiceException("Не удалось создать бд: " + dbName, e.getCause());
        } finally {
            if (newDataSource != null) {
                newDataSource.close();
            }
        }
    }

    public void delete(String dbName) {
        final MapSqlParameterSource source = new MapSqlParameterSource().addValue("dbName", dbName);

        // Предотвращаем возможность новых подключений
        parameterJdbcTemplate
                .update("UPDATE pg_database SET datallowconn = 'false' WHERE datname = :dbName", source);

        // Закрываем текущие сессии
        parameterJdbcTemplate.query(
                "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity " +
                        "WHERE pg_stat_activity.datname = :dbName AND pid <> pg_backend_pid()",
                source,
                new SingleColumnRowMapper<>());

        // Удаляем
        jdbcTemplate.update("DROP DATABASE " + dbName);
    }

    public boolean isDatabaseExist(String dbName) {
        try {
            return parameterJdbcTemplate.queryForObject(
                    "SELECT EXISTS (SELECT 1 FROM pg_database WHERE datname = :dbName)",
                    new MapSqlParameterSource().addValue("dbName", dbName),
                    Boolean.class);
        } catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }
    }
}
