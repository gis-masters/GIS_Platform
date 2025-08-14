package ru.mycrg.data_service.dao.ddl.database;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SingleColumnRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.dto.GeometryProjection;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.util.EpsgCodes;

import static ru.mycrg.data_service.dao.config.DatasourceFactory.INITIAL_SCHEMA_NAME;

@Service
public class DdlDatabase {

    private final Logger log = LoggerFactory.getLogger(DdlDatabase.class);

    private final JdbcTemplate jdbcTemplate;
    private final DatasourceFactory datasourceFactory;
    private final NamedParameterJdbcTemplate parameterJdbcTemplate;
    private final EpsgCodes epsgCodes;
    private final String owner;

    public DdlDatabase(Environment environment,
                       JdbcTemplate jdbcTemplate,
                       DatasourceFactory datasourceFactory,
                       NamedParameterJdbcTemplate parameterJdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.datasourceFactory = datasourceFactory;
        this.parameterJdbcTemplate = parameterJdbcTemplate;

        this.epsgCodes = new EpsgCodes();

        this.owner = environment.getRequiredProperty("spring.datasource.username");
    }

    /**
     * Создаем БД с расширением PostGis <br> (CREATE DATABASE cannot run inside a transaction block)
     *
     * @param dbName Название БД
     */
    public void create(String dbName) {
        HikariDataSource newDataSource = null;
        try {
            log.debug("Try create db: {}", dbName);

            final String sql = "CREATE DATABASE " + dbName + " WITH " +
                    " OWNER = " + owner +
                    " ENCODING = 'UTF8'" +
                    " LC_COLLATE = 'en_US.UTF-8'" +
                    " LC_CTYPE = 'en_US.UTF-8'" +
                    " TABLESPACE = pg_default" +
                    " CONNECTION LIMIT = -1 " +
                    " TEMPLATE template0";

            jdbcTemplate.execute(sql);
            jdbcTemplate.execute("GRANT ALL ON DATABASE " + dbName + " TO " + owner);

            // Подсоединяемся к только что созданной БД и создаем расширения postgis и pg_stat_statements
            newDataSource = datasourceFactory.getNotPoolableDataSource(dbName, INITIAL_SCHEMA_NAME);

            JdbcTemplate newDbJdbcTemplate = new JdbcTemplate(newDataSource);

            newDbJdbcTemplate.execute("CREATE EXTENSION IF NOT EXISTS postgis");
            newDbJdbcTemplate.execute("CREATE EXTENSION IF NOT EXISTS pg_stat_statements");

            // TODO: Кажется уже не надо учить БД этим проекциям
            GeometryProjection geometryProjection314314 = epsgCodes.getProjBySrid(314314);
            GeometryProjection geometryProjection314315 = epsgCodes.getProjBySrid(314315);

            // added new projections to spatial_ref_sys table for new organizations
            final String sqlGeometryProjection = "INSERT INTO public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text)" +
                    "VALUES (314314, 'EPSG', 314314,'" + geometryProjection314314.getWkt() + "','" + geometryProjection314314.getProj4text() + "')," +
                    "(314315, 'EPSG', 314315,'" + geometryProjection314315.getWkt() + "','" + geometryProjection314315.getProj4text() + "')";

            newDbJdbcTemplate.execute(sqlGeometryProjection);
        } catch (Exception e) {
            throw new DataServiceException("Не удалось создать бд: " + dbName, e.getCause());
        } finally {
            if (newDataSource != null) {
                newDataSource.close();
            }
        }
    }

    public void drop(String dbName) {
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

    public boolean isExist(String dbName) {
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
