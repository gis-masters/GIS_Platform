package ru.mycrg.wrapper.dao;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.enums.GeometryType;
import ru.mycrg.wrapper.exceptions.DaoException;

import static ru.mycrg.wrapper.dao.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;

@Service
public class CrgDaoGeometryHelper {

    private final Logger log = LoggerFactory.getLogger(CrgDaoGeometryHelper.class);

    public CrgDaoGeometryHelper() {
        // Required
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

    public void makeValid(JdbcTemplate jdbcTemplate, String schema, String table) throws DaoException {
        try {
            String geometryColumnName = DEFAULT_GEOMETRY_COLUMN_NAME;
            String sql = String.format("UPDATE %s.%s SET %s=st_makevalid(%s) WHERE st_isvalid(%s)=false;",
                    schema, table, geometryColumnName, geometryColumnName, geometryColumnName);

            jdbcTemplate.execute(sql);
        } catch (Exception e) {
            String msg = "Ошибка при исправлении геометрии для: " + schema + "." + table;

            throw new DaoException(msg, e.getCause());
        }
    }

    public void convertGeometryCollectionTo(JdbcTemplate jdbcTemplate, String schema, String table,
                                            @NotNull GeometryType geometryType) throws DaoException {
        try {
            String geometryColumnName = DEFAULT_GEOMETRY_COLUMN_NAME;
            String sql = String.format("UPDATE %s.%s SET %s=ST_CollectionExtract(%s, %d)",
                    schema, table, geometryColumnName, geometryColumnName, geometryTypeAsNumber(geometryType));

            log.debug("convertGeometryCollectionTo sql: {}", sql);

            jdbcTemplate.execute(sql);
        } catch (Exception e) {
            String msg = "Ошибка трансформации коллекции. Тип геометрии: " + geometryType;

            throw new DaoException(msg, e.getCause());
        }
    }

    /**
     * https://postgis.net/docs/ST_CollectionExtract.html
     */
    private int geometryTypeAsNumber(GeometryType geometryType) throws DaoException {
        switch (geometryType) {
            case POINT:             return 1;
            case MULTI_LINE_STRING: return 2;
            case MULTI_POLYGON:     return 3;
            default:
                throw new DaoException("Not supported geometry type: " + geometryType);
        }
    }
}
