package ru.mycrg.data_service.dao.ddl.tables;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.dao.utils.wellknown_formula_generator.PropertyBuilderWithFormula;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;

import java.sql.SQLException;
import java.util.List;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildCreateTableQuery;

@Repository
public class DdlTablesBaseDetached {

    private final Logger log = LoggerFactory.getLogger(DdlTablesBaseDetached.class);

    private final PropertyBuilderWithFormula propertyBuilder;

    public DdlTablesBaseDetached(PropertyBuilderWithFormula propertyBuilder) {
        this.propertyBuilder = propertyBuilder;
    }

    public void create(JdbcTemplate jdbcTemplate,
                       String schemaName,
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

    public List<ResourceQualifier> getAllTablesFromScheme(JdbcTemplate jdbcTemplate, String sourceSchema)
            throws SQLException {
        String query = "SELECT table_name" +
                " FROM information_schema.tables" +
                " WHERE table_schema = ?" +
                " AND table_type = 'BASE TABLE'" +
                " ORDER BY table_name";

        log.debug("Получение всех таблиц из схемы: [{}] запросом: [{}]", sourceSchema, query);

        try {
            List<String> tableNames = jdbcTemplate.queryForList(query, String.class, sourceSchema);

            return tableNames.stream()
                             .map(tableName -> new ResourceQualifier(sourceSchema, tableName))
                             .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Не получилось достать все таблицы из схемы: {}, Ошибка: {}", sourceSchema, e.getMessage());

            throw new SQLException("Достать таблицы из схемы " + sourceSchema + " невозможно. Причина: " + e.getMessage());
        }
    }
}
