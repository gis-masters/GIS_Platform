package ru.mycrg.data_service.dao.basemaps;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.ConnectionInfo;
import ru.mycrg.data_service.dao.CrgDataSourceFactory;
import ru.mycrg.data_service.dao.DaoException;
import ru.mycrg.data_service.entity.BaseMapEntity;

import java.util.List;

@Service
public class CrgBaseMapsDao {

    private final CrgDataSourceFactory dataSourceFactory;

    public CrgBaseMapsDao(CrgDataSourceFactory dataSourceFactory) {
        this.dataSourceFactory = dataSourceFactory;
    }

    public List<BaseMapEntity> getAll(List<Long> baseMapsIds, ConnectionInfo target) throws DaoException {
        try {
            final String sql = String.format("SELECT * FROM %s.%s WHERE id IN (:BASEMAPS_IDS)",
                    target.getSchemaName(), target.getTableName());

            final HikariDataSource datasource = dataSourceFactory.getDatasource(target.getDbName());

            MapSqlParameterSource parameters = new MapSqlParameterSource();
            parameters.addValue("BASEMAPS_IDS", baseMapsIds);

            NamedParameterJdbcTemplate namedJdbcTemplate = new NamedParameterJdbcTemplate(datasource);

            return namedJdbcTemplate.query(sql, parameters, BeanPropertyRowMapper.newInstance(BaseMapEntity.class));
        } catch (Exception e) {
            throw new DaoException(e.getMessage());
        }
    }

}
