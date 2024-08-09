package ru.mycrg.data_service.dao.ddl.tables;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.utils.wellknown_formula_generator.PropertyBuilderWithFormula;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;

import java.util.List;

import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildCreateTableQuery;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildDeleteTableQuery;

@Repository
public class DdlTablesBase {

    private final Logger log = LoggerFactory.getLogger(DdlTablesBase.class);

    private final JdbcTemplate jdbcTemplate;
    private final PropertyBuilderWithFormula propertyBuilder;

    public DdlTablesBase(JdbcTemplate jdbcTemplate,
                         PropertyBuilderWithFormula propertyBuilder) {
        this.jdbcTemplate = jdbcTemplate;
        this.propertyBuilder = propertyBuilder;
    }

    public void create(String schemaName,
                       String tableName,
                       List<SimplePropertyDto> properties,
                       String primaryKeyName) {
        String query = buildCreateTableQuery(schemaName,
                                             tableName,
                                             primaryKeyName,
                                             propertyBuilder.buildProps(properties, primaryKeyName));

        log.debug("Create table query: [{}]", query);

        jdbcTemplate.execute(query);
    }

    @Transactional
    public void drop(ResourceQualifier qualifier) {
        log.debug("Try delete: {}", qualifier);
        try {
            jdbcTemplate.execute(buildDeleteTableQuery(qualifier));
        } catch (Exception e) {
            String msg = "Ошибка при удалении таблицы " + qualifier;

            throw new DataServiceException(msg);
        }
    }

    /**
     * Вернёт true если существуют и схема и таблица.
     *
     * @param rQualifier Объект описывающий ресурс
     */
    public boolean isExist(ResourceQualifier rQualifier) {
        String query = "SELECT EXISTS (SELECT 1 FROM information_schema.tables " +
                "WHERE table_schema = '" + rQualifier.getSchema() + "' " +
                "AND table_name = '" + rQualifier.getTable() + "')";

        try {
            log.debug("SQL is schema and table exist: [{}]", query);

            Boolean result = jdbcTemplate.queryForObject(query, Boolean.class);

            return Boolean.TRUE.equals(result);
        } catch (DataAccessException e) {
            log.warn("Check table: {} failed: {}", rQualifier, e.getMessage());

            return true;
        }
    }
}
