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
            String geometryColumnName = DEFAULT_GEOMETRY_COLUMN_NAME;
            String sql = String.format("UPDATE %s.%s SET %s=public.st_makevalid(%s) WHERE public.st_isvalid(%s)=false",
                                       schema, table, geometryColumnName, geometryColumnName, geometryColumnName);

            jdbcTemplate.execute(sql);
        } catch (Exception e) {
            String msg = "Ошибка при исправлении геометрии для: " + schema + "." + table;

            throw new CrgDaoException(msg, e.getCause());
        }
    }
}
