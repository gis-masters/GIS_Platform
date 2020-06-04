package ru.mycrg.data_service.dao;

import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.log4j.Log4j2;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.DataServiceException;

import static ru.mycrg.data_service.dao.CrgDataSourcesPool.INITIAL_SCHEMA_NAME;

@Log4j2
@Service
public class DatabaseDDL {

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
        if (isDatabaseExist(dbName)) {
            throw new ConflictException("Database "+ dbName + " exist");
        }

        HikariDataSource newDataSource = null;
        try {
            log.debug("Try create db: {}", dbName);

            final String sql = "CREATE DATABASE " + dbName + " WITH " +
                    " OWNER = " + crgDataSourcesPool.getInitialUser()  +
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
