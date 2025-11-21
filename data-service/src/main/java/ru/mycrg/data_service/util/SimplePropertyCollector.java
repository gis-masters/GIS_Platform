package ru.mycrg.data_service.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import ru.mycrg.common_contracts.exceptions.ClientException;
import ru.mycrg.data_service.dao.ddl.tables.DdlTablesSpecialDetached;
import ru.mycrg.data_service.dto.ColumnShortInfo;
import ru.mycrg.data_service.mappers.TypeMapper;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ValueType;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.dao.config.DaoProperties.PRIMARY_KEY;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.*;

@Component
public class SimplePropertyCollector {

    private final Logger log = LoggerFactory.getLogger(SimplePropertyCollector.class);

    private final DdlTablesSpecialDetached ddlTablesSpecial;

    public SimplePropertyCollector(DdlTablesSpecialDetached ddlTablesSpecial) {
        this.ddlTablesSpecial = ddlTablesSpecial;
    }

    public List<SimplePropertyDto> getSimpleProperties(JdbcTemplate jdbcTemplate,
                                                       ResourceQualifier sourceTable,
                                                       Set<String> columnsForExclude) {
        List<ColumnShortInfo> tableColumns = getColumnsInfo(jdbcTemplate, sourceTable);
        tableColumns = tableColumns.stream()
                                   .filter(columnInfo -> !columnsForExclude.contains(columnInfo.getColumnName()))
                                   .collect(Collectors.toList());

        return tableColumns
                .stream()
                .map(columnInfo -> {
                    SimplePropertyDto targetProp = new SimplePropertyDto();
                    String columnName = columnInfo.getColumnName();
                    targetProp.setName(columnName);
                    targetProp.setTitle(columnName);
                    targetProp.setValueType(TypeMapper.map(columnInfo).orElse(ValueType.STRING));

                    return targetProp;
                })
                .collect(Collectors.toList());
    }

    public List<SimplePropertyDto> getSimpleProperties(JdbcTemplate jdbcTemplate,
                                                       ResourceQualifier sourceTable) {
        Set<String> columnsForExclude = Set.of(PRIMARY_KEY,
                                               CREATED_AT.getName(),
                                               UPDATED_BY.getName(),
                                               CREATED_BY.getName(),
                                               LAST_MODIFIED.getName());

        return getSimpleProperties(jdbcTemplate, sourceTable, columnsForExclude);
    }

    private List<ColumnShortInfo> getColumnsInfo(JdbcTemplate jdbcTemplate, ResourceQualifier sourceTable) {
        try {
            return ddlTablesSpecial.getColumnShortInfo(sourceTable, jdbcTemplate);
        } catch (Exception e) {
            log.error("Сбор колонок после импорта shp файла провалился: {}", e.getMessage(), e);

            throw new ClientException("Сбор колонок после импорта shp файла провалился");
        }
    }
}
