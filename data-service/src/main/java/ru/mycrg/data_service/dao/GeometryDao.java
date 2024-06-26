package ru.mycrg.data_service.dao;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;

import static ru.mycrg.data_service.dao.config.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;

@Service
public class GeometryDao {

    private final JdbcTemplate jdbcTemplate;

    public GeometryDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void makeValid(String schema, String table) throws CrgDaoException {
        try {
            String query = String.format("UPDATE %s.%s " +
                                                 "SET %3$s=public.st_makevalid(%3$s) " +
                                                 "WHERE public.st_isvalid(%3$s)=false",
                                         schema, table, DEFAULT_GEOMETRY_COLUMN_NAME);

            jdbcTemplate.execute(query);
        } catch (Exception e) {
            String msg = "Ошибка при исправлении геометрии для: " + schema + "." + table;

            throw new CrgDaoException(msg, e.getCause());
        }
    }
}
