package ru.mycrg.data_service.dao;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import static ru.mycrg.data_service.dao.config.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;

@Repository
public class GeometryDaoDetached {

    BaseWriteDaoDetached baseWriteDaoDetached;

    GeometryDaoDetached(BaseWriteDaoDetached baseWriteDaoDetached) {
        this.baseWriteDaoDetached = baseWriteDaoDetached;
    }

    public void makeValid(JdbcTemplate jdbcTemplate, String schema, String table) throws CrgDaoException {
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

    public int getInvalidGeometryRowsCount(JdbcTemplate jdbcTemplate, String schema, String table)
            throws CrgDaoException {
        try {
            String sql = String.format(
                    "SELECT COUNT(*) FROM %s.%s WHERE public.ST_IsValid(%s) = false",
                    schema, table, DEFAULT_GEOMETRY_COLUMN_NAME
            );

            Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
            return count != null ? count : 0;
        } catch (Exception e) {
            String msg = "Ошибка при подсчёте неправильных геометрий таблицы: " + schema + "." + table;

            throw new CrgDaoException(msg, e.getCause());
        }
    }

    public void deleteAllRowsWithInvalidGeometry(JdbcTemplate jdbcTemplate, ResourceQualifier resourceQualifier)
            throws CrgDaoException {
        try {
            String filter = String.format("public.ST_IsValid(%s)=false", DEFAULT_GEOMETRY_COLUMN_NAME);

            baseWriteDaoDetached.removeRecordsWithFilter(jdbcTemplate, resourceQualifier, filter);
        } catch (Exception e) {
            String msg = "Не получилось удалить неправильную геометрию из таблицы: " + resourceQualifier.getQualifier();

            throw new CrgDaoException(msg, e.getCause());
        }
    }
}
