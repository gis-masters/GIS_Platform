package ru.mycrg.data_service.dao.ddl;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dto.TableCreateDto;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.AdditionalFieldDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ForeignKeyType;
import ru.mycrg.data_service_contract.enums.ValueType;

import java.util.List;
import java.util.Optional;

import static java.util.Objects.isNull;
import static ru.mycrg.data_service.dao.config.DaoProperties.*;
import static ru.mycrg.data_service.util.CrsHandler.extractCrsNumber;

@Repository
public class DdlTables {

    private final Logger log = LoggerFactory.getLogger(DdlTables.class);

    private final JdbcTemplate jdbcTemplate;
    private final SchemasAndTablesRepository schemasAndTablesRepository;

    public DdlTables(JdbcTemplate jdbcTemplate,
                     SchemasAndTablesRepository schemasAndTablesRepository) {
        this.jdbcTemplate = jdbcTemplate;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
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
            propertiesBuilder.append(",").append(generatePropertySqlString(property));
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

    @Transactional
    public void drop(ResourceQualifier rQualifier) {
        log.debug("Try delete: {}", rQualifier);
        String extensionTable = rQualifier.getTable() + EXTENSION_POSTFIX;

        //drop with extension table
        jdbcTemplate.execute(String.format("DROP TABLE IF EXISTS %1$s.\"%2$s\",%1$s.\"%3$s\" ",
                                           rQualifier.getSchema(), rQualifier.getTable(), extensionTable));

        schemasAndTablesRepository.deleteByIdentifier(rQualifier.getTable());
    }

    private boolean isGeometryExist(String createTableSql) {
        return createTableSql.contains("shape public.geometry");
    }

    public List<String> getAllColumnNames(String tableName) {
        String query = "SELECT column_name " +
                "FROM INFORMATION_SCHEMA.COLUMNS " +
                "WHERE TABLE_NAME = '" + tableName + "'";

        return jdbcTemplate.queryForList(query, String.class);
    }

    @NotNull
    private String handleChoice(@NotNull SimplePropertyDto attrDescription) {
        ForeignKeyType foreignKeyType = attrDescription.getForeignKeyType();
        if (foreignKeyType == null) {
            log.warn("ForeignKeyType not set. Will be used string type");

            return attrDescription.getName() + " character varying(255)";
        }

        switch (foreignKeyType) {
            case STRING:
                return attrDescription.getName() + " character varying(255)";
            case INTEGER:
                return attrDescription.getName() + " integer";
            case LONG:
                return attrDescription.getName() + " bigint";
            default:
                log.warn("Unknown foreignKeyType: {}. Will be used string type", foreignKeyType);
                return attrDescription.getName() + " character varying(255)";
        }
    }

    @NotNull
    private String generatePropertySqlString(@NotNull SimplePropertyDto attrDescription) {
        String result;
        switch (attrDescription.getValueTypeAsEnum()) {
            case INT:
                result = attrDescription.getName() + " integer";
                break;
            case CHOICE:
                result = handleChoice(attrDescription);
                break;
            case STRING:
                Integer maxLength = attrDescription.getMaxLength();
                if (isNull(maxLength) || maxLength < 255) {
                    maxLength = 255;
                }

                result = attrDescription.getName() + " character varying(" + maxLength + ")";
                break;
            case DOUBLE:
                result = attrDescription.getName() + " numeric(38,8)";
                break;
            case URL:
                result = attrDescription.getName() + " text";
                break;
            case GEOMETRY:
                result = "shape public.geometry";
                break;
            case DATETIME:
                result = attrDescription.getName() + " timestamp";
                break;
            case LOOKUP:
                result = attrDescription.getName() + " text";
                break;
            case FILE:
                result = attrDescription.getName() + " jsonb";
                break;
            default:
                log.warn("Not supported attribute type: {}", attrDescription.getValueTypeAsEnum());

                result = attrDescription.getName() + " character varying";
        }

        String formula = attrDescription.getCalculatedValueWellKnownFormula();
        if (formula != null) {
            if (formula.equals("st_area")) {
                result = result + " GENERATED ALWAYS AS (public.st_area(shape)) STORED";
            } else if (formula.equals("st_length")) {
                result = result + " GENERATED ALWAYS AS (public.st_length(shape)) STORED";
            } else {
                log.warn("Unknown valueWellKnownFormula: {}", formula);
            }
        }

        return result;
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
