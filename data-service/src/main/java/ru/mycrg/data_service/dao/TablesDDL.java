package ru.mycrg.data_service.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class TablesDDL {

    private static Logger log = LoggerFactory.getLogger(TablesDDL.class);

    private final JdbcTemplate jdbcTemplate;

    public TablesDDL(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean isTableExist(String schemaName, String tableName) {
        String sql = "SELECT EXISTS (SELECT 1 FROM information_schema.tables " +
                "WHERE table_schema = '" + schemaName + "' " +
                "AND table_name = '" + tableName + "')";

        try {
            return jdbcTemplate.queryForObject(sql, Boolean.class);
        } catch (DataAccessException e) {
            log.warn("Check table: {} failed: {}", schemaName + ":" + tableName, e.getMessage());

            return false;
        }
    }

}
