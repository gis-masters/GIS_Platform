package ru.mycrg.data_service.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;
import ru.mycrg.data_service.service.resources.ResourceManager;

@Service
public class TablesManager implements ResourceManager {

    private static final Logger log = LoggerFactory.getLogger(TablesManager.class);

    private final JdbcTemplate jdbcTemplate;

    public TablesManager(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void create(ResourceIdentifier rIdentifier) {
        throw new DataServiceException("Not implemented");
    }

    /**
     * Вернёт true если существуют и схема и таблица.
     *
     * @param table Обьект описывающий ресурс
     */
    @Override
    public boolean isExist(ResourceIdentifier table) {
        ResourceIdentifier schema = table.getParent();

        String sql = "SELECT EXISTS (SELECT 1 FROM information_schema.tables " +
                "WHERE table_schema = '" + schema.getId() + "' " +
                "AND table_name = '" + table.getId() + "')";

        try {
            return jdbcTemplate.queryForObject(sql, Boolean.class);
        } catch (DataAccessException e) {
            log.warn("Check table: {} failed: {}", table.toString(), e.getMessage());

            return true;
        }
    }

    @Override
    public void delete(ResourceIdentifier rIdentifier) {
        throw new DataServiceException("Not implemented");
    }
}
