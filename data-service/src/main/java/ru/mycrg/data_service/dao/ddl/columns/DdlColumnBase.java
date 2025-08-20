package ru.mycrg.data_service.dao.ddl.columns;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

@Repository
public class DdlColumnBase {

    private final Logger log = LoggerFactory.getLogger(DdlColumnBase.class);

    private final JdbcTemplate jdbcTemplate;

    public DdlColumnBase(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void add(ResourceQualifier qualifier, String name, String type) {
        String query = String.format("ALTER TABLE IF EXISTS %s ADD COLUMN IF NOT EXISTS %s %s",
                                     qualifier.getTableQualifier(), name, type);

        log.debug("Запрос на добавление колонки: '{}': [{}]", name, query);

        jdbcTemplate.execute(query);
    }

    public void drop(ResourceQualifier qualifier, String name) {
        try {
            String query = String.format("ALTER TABLE IF EXISTS %s DROP COLUMN IF EXISTS %s",
                                         qualifier.getTableQualifier(), name);

            log.debug("Запрос на удаление колонки: '{}': [{}]", name, query);

            jdbcTemplate.execute(query);
        } catch (Exception e) {
            String msg = "Ошибка при удалении колонки " + qualifier;

            throw new DataServiceException(msg);
        }
    }
}
