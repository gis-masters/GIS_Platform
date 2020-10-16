package ru.mycrg.data_service.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.service.TableIdentifier;

@Service
public class TablesDDL {

    private static final Logger log = LoggerFactory.getLogger(TablesDDL.class);

    private final JdbcTemplate jdbcTemplate;

    public TablesDDL(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean isTableExist(TableIdentifier resource) {
        String sql = "SELECT EXISTS (SELECT 1 FROM information_schema.tables " +
                "WHERE table_schema = '" + resource.getSchema() + "' " +
                "AND table_name = '" + resource.getTable() + "')";

        try {
            return jdbcTemplate.queryForObject(sql, Boolean.class);
        } catch (DataAccessException e) {
            log.warn("Check table: {} failed: {}", resource.toString(), e.getMessage());

            return false;
        }
    }

}
