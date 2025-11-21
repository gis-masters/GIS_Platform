package ru.mycrg.data_service.dao.ddl.tables;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.dto.ColumnShortInfo;
import ru.mycrg.data_service.dto.TableCreateDto;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;

import java.util.List;

@Repository
public class DdlTablesSpecial {

    private final Logger log = LoggerFactory.getLogger(DdlTablesSpecial.class);

    private final JdbcTemplate jdbcTemplate;
    private final DdlTablesSpecialDetached ddlTablesSpecialDetached;

    public DdlTablesSpecial(JdbcTemplate jdbcTemplate,
                            DdlTablesSpecialDetached ddlTablesSpecialDetached) {
        this.jdbcTemplate = jdbcTemplate;
        this.ddlTablesSpecialDetached = ddlTablesSpecialDetached;
    }

    public List<String> getAllColumnNames(String tableName) {
        String query = "SELECT column_name " +
                "FROM INFORMATION_SCHEMA.COLUMNS " +
                "WHERE TABLE_NAME = '" + tableName.toLowerCase() + "'";

        return jdbcTemplate.queryForList(query, String.class);
    }

    public void create(String targetSchema, TableCreateDto dto, List<SimplePropertyDto> properties) {
        ddlTablesSpecialDetached.create(jdbcTemplate, targetSchema, dto, properties);
    }

    public List<ColumnShortInfo> getColumnShortInfo(ResourceQualifier tableName) {
        return ddlTablesSpecialDetached.getColumnShortInfo(tableName, jdbcTemplate);
    }
}
