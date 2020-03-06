package ru.mycrg.wrapper.dao;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.wrapper.exceptions.DaoException;

import static ru.mycrg.wrapper.dao.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;

@Service
public class CrgDaoGeometryHelper {

    public CrgDaoGeometryHelper() {
    }

    public Integer countInvalid(JdbcTemplate jdbcTemplate, String schema, String table) throws DaoException {
        try {
            String sql = String.format("SELECT COUNT(*) FROM %s.%s WHERE st_isvalid(%s)=false",
                    schema, table, DEFAULT_GEOMETRY_COLUMN_NAME);

            return jdbcTemplate.queryForObject(sql, Integer.class);
        } catch (Exception e) {
            String msg = "Не удалось выполнить подсчет невалидных объектов для: " + schema + "." + table;

            throw new DaoException(msg, e.getCause());
        }
    }

    public Integer countWithoutGeometry(JdbcTemplate jdbcTemplate, String schema, String table) throws DaoException {
        try {
            String sql = String.format("SELECT COUNT(*) FROM %s.%s WHERE %s IS NULL",
                    schema, table, DEFAULT_GEOMETRY_COLUMN_NAME);

            return jdbcTemplate.queryForObject(sql, Integer.class);
        } catch (Exception e) {
            String msg = "Не удалось выполнить подсчет объектов без геометрии для: " + schema + "." + table;

            throw new DaoException(msg, e.getCause());
        }
    }

    public void makeValid(JdbcTemplate jdbcTemplate, String schema, String table) throws DaoException {
        try {
            String shape = DEFAULT_GEOMETRY_COLUMN_NAME;
            String sql = String.format("update %s.%s set %s=st_makevalid(%s) where st_isvalid(%s)=false;",
                    schema, table, shape, shape, shape);

            jdbcTemplate.execute(sql);
        } catch (Exception e) {
            String msg = "Ошибка при исправлении геометрии для: " + schema + "." + table;

            throw new DaoException(msg, e.getCause());
        }
    }

}
