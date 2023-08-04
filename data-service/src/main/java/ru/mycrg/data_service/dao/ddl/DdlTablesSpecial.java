package ru.mycrg.data_service.dao.ddl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.dto.TableCreateDto;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.AdditionalFieldDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ValueType;

import java.util.List;
import java.util.Optional;

import static ru.mycrg.data_service.dao.config.DaoProperties.*;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.generatePropertySqlString;
import static ru.mycrg.data_service.util.CrsHandler.extractCrsNumber;

@Repository
public class DdlTablesSpecial {

    private final DdlTablesBase ddlTablesBase;
    private final JdbcTemplate jdbcTemplate;

    private final Logger log = LoggerFactory.getLogger(DdlTablesSpecial.class);

    public DdlTablesSpecial(DdlTablesBase ddlTablesBase,
                            JdbcTemplate jdbcTemplate) {
        this.ddlTablesBase = ddlTablesBase;
        this.jdbcTemplate = jdbcTemplate;
    }

    public void create(String targetSchema, TableCreateDto dto, List<SimplePropertyDto> schemaProperties) {
        String targetTable = dto.getName();
        Integer crsCode = extractCrsNumber(dto.getCrs());
        String target = targetSchema + "." + targetTable;
        String extensionTable = targetTable + EXTENSION_POSTFIX;

        // add additional fields
        addAdditionalFields(schemaProperties, dto.getAdditionalFields());

        StringBuilder propertiesBuilder = new StringBuilder();

        // Добавляем ruleid если его нет в схеме. Типа он обязательно должен быть.
        Optional<SimplePropertyDto> oRuleId = schemaProperties
                .stream()
                .filter(simplePropertyDto -> simplePropertyDto.getName().equalsIgnoreCase(RULE_ID))
                .findFirst();
        if (oRuleId.isEmpty()) {
            propertiesBuilder.append(" ,ruleid character varying(255)");
        }

        for (SimplePropertyDto property: schemaProperties) {
            String formulaName = property.getCalculatedValueWellKnownFormula();

            String generateProperties = generatePropertySqlString(property);
            String result = ddlTablesBase.wellKnownFormulaGenerate(formulaName, generateProperties);

            propertiesBuilder.append(",").append(result);
        }

        String query = String.format(
                "CREATE TABLE %1$s (%2$s serial NOT NULL %3$s ); ALTER TABLE ONLY %1$s ADD " +
                        "CONSTRAINT %4$s_pkey PRIMARY KEY (%2$s);",
                target, PRIMARY_KEY, propertiesBuilder, targetTable);

        // Add GEOMETRY CONSTRAINT
        boolean geometryExist = isGeometryExist(query);
        if (geometryExist) {
            query = String.format(
                    "%s ALTER TABLE ONLY %s ADD CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = %s));",
                    query, target, crsCode);
        }

        log.debug("Create table query: [{}]", query);

        jdbcTemplate.execute(query);
        jdbcTemplate.execute(getExtensionTableQuery(targetSchema, extensionTable));

        if (geometryExist) {
            String indexName = targetTable + "_idx";
            String createIndexQuery = String.format("CREATE INDEX %s ON %s USING gist (shape)", indexName, target);

            jdbcTemplate.execute(createIndexQuery);
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

    private boolean isGeometryExist(String createTableSql) {
        return createTableSql.contains("shape public.geometry");
    }

    public List<String> getAllColumnNames(String tableName) {
        String query = "SELECT column_name " +
                "FROM INFORMATION_SCHEMA.COLUMNS " +
                "WHERE TABLE_NAME = '" + tableName.toLowerCase() + "'";

        return jdbcTemplate.queryForList(query, String.class);
    }

    private String getExtensionTableQuery(String targetSchema, String extensionTable) {
        return "CREATE TABLE " + targetSchema + "." + extensionTable + " (" +
                "   object_id serial NOT NULL, " +
                "   violations jsonb, " +
                "   _xmin integer, " +
                "   valid boolean, " +
                "   class_id integer);" +
                "ALTER TABLE ONLY " + targetSchema + "." + extensionTable +
                "   ADD CONSTRAINT " + extensionTable + "_pkey PRIMARY KEY (object_id);";
    }

    private void addAdditionalFields(List<SimplePropertyDto> schemaProperties,
                                     List<AdditionalFieldDto> additionalFields) {
        if (!additionalFields.isEmpty()) {
            additionalFields.forEach(additionalField -> {
                SimplePropertyDto additionalProperty = new SimplePropertyDto();
                additionalProperty.setName(additionalField.getName());
                try {
                    additionalProperty.setValueType(ValueType.valueOf(additionalField.getType().toUpperCase()));
                } catch (IllegalArgumentException ex) {
                    log.warn("Unknown type : {} . Additional field type cannot be cast. {}",
                             additionalField.getType(),
                             ex.getMessage());
                    additionalProperty.setValueType(ValueType.STRING);
                }
                schemaProperties.add(additionalProperty);
            });
        }
    }
}
