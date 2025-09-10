package ru.mycrg.data_service.dao.ddl.tables;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.dto.ColumnShortInfo;
import ru.mycrg.data_service.dto.TableCreateDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;

import java.util.List;

import static ru.mycrg.data_service.dao.config.DaoProperties.EXTENSION_POSTFIX;
import static ru.mycrg.data_service.dao.config.DaoProperties.PRIMARY_KEY;
import static ru.mycrg.data_service.util.CrsHandler.extractCrsNumber;

@Repository
public class DdlTablesSpecial {

    private final Logger log = LoggerFactory.getLogger(DdlTablesSpecial.class);

    private final JdbcTemplate jdbcTemplate;
    private final DdlTablesBase ddlTablesBase;
    private final DdlTablesSpecialDetached ddlTablesSpecialDetached;

    public DdlTablesSpecial(DdlTablesBase ddlTablesBase,
                            JdbcTemplate jdbcTemplate, DdlTablesSpecialDetached ddlTablesSpecialDetached) {
        this.ddlTablesBase = ddlTablesBase;
        this.jdbcTemplate = jdbcTemplate;
        this.ddlTablesSpecialDetached = ddlTablesSpecialDetached;
    }

    public void create(String targetSchema, TableCreateDto dto, List<SimplePropertyDto> properties) {
        // add additional fields
        ddlTablesSpecialDetached.addAdditionalFields(properties, dto.getAdditionalFields());

        String targetTable = dto.getName();
        ddlTablesBase.create(targetSchema, targetTable, properties, PRIMARY_KEY);

        String extensionTable = targetTable + EXTENSION_POSTFIX;
        jdbcTemplate.execute(ddlTablesSpecialDetached.getExtensionTableCreateQuery(targetSchema, extensionTable));

        boolean geometryExist = ddlTablesSpecialDetached.isGeometryExist(properties);
        if (geometryExist) {
            Integer crsCode = extractCrsNumber(dto.getCrs());
            String target = targetSchema + "." + targetTable;

            // Add GEOMETRY CONSTRAINT
            String addConstraintQuery = String.format(
                    "ALTER TABLE ONLY %s ADD CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = %s));",
                    target, crsCode);
            log.debug("Add constraint query: [{}]", addConstraintQuery);
            jdbcTemplate.execute(addConstraintQuery);

            // Add index on GEOMETRY field
            String createIndexQuery = String.format("CREATE INDEX %s ON %s USING gist (shape)",
                                                    targetTable + "_idx", target);
            log.debug("Create index query: [{}]", createIndexQuery);
            jdbcTemplate.execute(createIndexQuery);
        }
    }

    public List<String> getAllColumnNames(String tableName) {
        String query = "SELECT column_name " +
                "FROM INFORMATION_SCHEMA.COLUMNS " +
                "WHERE TABLE_NAME = '" + tableName.toLowerCase() + "'";

        return jdbcTemplate.queryForList(query, String.class);
    }

    public List<ColumnShortInfo> getColumnShortInfo(String tableName) {
        return getColumnShortInfo(tableName, jdbcTemplate);
    }

    public List<ColumnShortInfo> getColumnShortInfo(String tableName, JdbcTemplate jdbcTemplate) {
        String query = "SELECT column_name, udt_name, character_maximum_length, numeric_scale " +
                "FROM INFORMATION_SCHEMA.COLUMNS " +
                "WHERE TABLE_NAME = '" + tableName.toLowerCase() + "'";

        return jdbcTemplate.query(query, new BeanPropertyRowMapper<>(ColumnShortInfo.class));
    }
}
