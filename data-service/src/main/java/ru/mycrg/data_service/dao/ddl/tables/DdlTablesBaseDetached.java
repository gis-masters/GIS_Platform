package ru.mycrg.data_service.dao.ddl.tables;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.dao.utils.wellknown_formula_generator.PropertyBuilderWithFormula;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;

import java.util.List;

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
}
