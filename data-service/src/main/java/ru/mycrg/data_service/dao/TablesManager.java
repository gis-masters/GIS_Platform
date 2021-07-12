package ru.mycrg.data_service.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.ResourceManager;

@Service
public class TablesManager implements ResourceManager {

    private static final Logger log = LoggerFactory.getLogger(TablesManager.class);

    private final JdbcTemplate jdbcTemplate;

    public static final String EXTENSION_POSTFIX = "_extension";

    public TablesManager(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void create(ResourceQualifier rIdentifier) {
        throw new DataServiceException("Not implemented");
    }

    /**
     * Вернёт true если существуют и схема и таблица.
     *
     * @param rQualifier Объект описывающий ресурс
     */
    @Override
    public boolean isExist(ResourceQualifier rQualifier) {
        String sql = "SELECT EXISTS (SELECT 1 FROM information_schema.tables " +
                "WHERE table_schema = '" + rQualifier.getSchema() + "' " +
                "AND table_name = '" + rQualifier.getTable() + "')";

        try {
            final Boolean result = jdbcTemplate.queryForObject(sql, Boolean.class);

            return Boolean.TRUE.equals(result);
        } catch (DataAccessException e) {
            log.warn("Check table: {} failed: {}", rQualifier, e.getMessage());

            return true;
        }
    }

    @Override
    @Transactional
    public void delete(ResourceQualifier rQualifier) {
        log.debug("Try delete: {}", rQualifier);

        jdbcTemplate.execute(String.format("DROP TABLE IF EXISTS %s.\"%s\"",
                                           rQualifier.getSchema(), rQualifier.getTable()));
    }
}
