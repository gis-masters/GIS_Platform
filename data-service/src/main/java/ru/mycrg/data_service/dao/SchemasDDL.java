package ru.mycrg.data_service.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class SchemasDDL {

    private static Logger log = LoggerFactory.getLogger(SchemasDDL.class);

    private final JdbcTemplate jdbcTemplate;

    public SchemasDDL(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean isSchemaExist(String schemaName) {
        String sql = "SELECT EXISTS(SELECT 1 FROM pg_namespace WHERE nspname = '" + schemaName + "')";

        try {
            return jdbcTemplate.queryForObject(sql, Boolean.class);
        } catch (DataAccessException e) {
            log.warn("Check schema: {} failed: {}", schemaName, e.getMessage());

            return false;
        }
    }

}
