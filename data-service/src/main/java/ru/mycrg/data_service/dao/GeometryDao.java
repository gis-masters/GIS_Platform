package ru.mycrg.data_service.dao;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;

@Repository
public class GeometryDao {

    private final JdbcTemplate jdbcTemplate;
    private final GeometryDaoDetached daoDetached;

    public GeometryDao(JdbcTemplate jdbcTemplate, GeometryDaoDetached daoDetached) {
        this.jdbcTemplate = jdbcTemplate;
        this.daoDetached = daoDetached;
    }

    public void makeValid(String schema, String table) throws CrgDaoException {
        daoDetached.makeValid(jdbcTemplate, schema, table);
    }
}
