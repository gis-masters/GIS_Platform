package ru.mycrg.data_service.dao.ddl.schemas;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.SQLException;

@Service
public class DdlSchemasDetached {

    private final Logger log = LoggerFactory.getLogger(DdlSchemasDetached.class);

    public DdlSchemasDetached() {
    }

    public void drop(JdbcTemplate jdbcTemplate, String schemaName) throws SQLException {
        try {
            log.debug("Удаление схемы {}", schemaName);

            jdbcTemplate.execute("DROP SCHEMA IF EXISTS " + schemaName + " CASCADE");
        } catch (DataAccessException e) {
            String msg = "Не удалось удалить схему: " + schemaName;

            log.error(msg);

            throw new SQLException(msg, e.getCause());
        }
    }
}
