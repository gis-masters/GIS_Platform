package ru.mycrg.data_service.dao.ddl.tables;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.exceptions.DataServiceException;

@Repository
public class DdlConstraints {

    private final Logger log = LoggerFactory.getLogger(DdlConstraints.class);

    private final JdbcTemplate jdbcTemplate;

    public DdlConstraints(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void makeConstraints(String targetTable,
                                String sourceTable,
                                String useArea,
                                String columnName,
                                String referencedColumnName,
                                String action) {
        String constraintName = String.join("_",
                                            "fk",
                                            useArea.toLowerCase(),
                                            columnName.toLowerCase());

        String sql = "ALTER TABLE " + targetTable +
                " ADD CONSTRAINT " + constraintName +
                " FOREIGN KEY (" + columnName + ")" +
                " REFERENCES " + sourceTable + "(" + referencedColumnName + ")" +
                " MATCH SIMPLE " + action + ";";

        log.debug("Запрос на построение внешнего ключа: {}", sql);

        try {
            jdbcTemplate.execute(sql);
            log.info("Successfully created constraint {} on {}",
                     constraintName, targetTable);
        } catch (Exception e) {
            String msg = "Ошибка при добавлении внешнего ключа " + e.getMessage();

            throw new DataServiceException(msg);
        }
    }
}
