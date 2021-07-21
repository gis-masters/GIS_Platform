package ru.mycrg.data_service.dao;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dto.TableCreateDto;
import ru.mycrg.data_service.service.resources.ResourceManager;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.util.CrsHandler;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ForeignKeyType;

@Service
public class TablesManager implements ResourceManager {

    private static final Logger log = LoggerFactory.getLogger(TablesManager.class);
    private static final String PRIMARY_KEY = "objectid";

    public static final String EXTENSION_POSTFIX = "_extension";

    private final JdbcTemplate jdbcTemplate;
    private final CrsHandler crsHandler;

    public TablesManager(JdbcTemplate jdbcTemplate, CrsHandler crsHandler) {
        this.jdbcTemplate = jdbcTemplate;
        this.crsHandler = crsHandler;
    }

    public void createTable(String targetSchema, TableCreateDto dto, SchemaDto schemaDto) {
        String targetTable = dto.getName();
        Integer crsCode = crsHandler.extractCrsNumber(dto.getCrs());
        String target = targetSchema + "." + targetTable;
        String extensionTable = targetTable + EXTENSION_POSTFIX;

        String properties = "";
        for (SimplePropertyDto property: schemaDto.getProperties()) {
            properties = properties + "," + generatePropertySqlString(property);
        }

        String createTableSql = String.format(
                "CREATE TABLE %1$s (%2$s serial NOT NULL %3$s ); ALTER TABLE ONLY %1$s ADD " +
                        "CONSTRAINT %4$s_pkey PRIMARY KEY (%2$s);",
                target,
                PRIMARY_KEY,
                properties,
                targetTable);

        // Add GEOMETRY CONSTRAINT
        if (isGeometryExist(createTableSql)) {
            createTableSql = String.format(
                    "%3$s ALTER TABLE ONLY %1$s ADD CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = " +
                            "%2$s));", target, crsCode, createTableSql);
        }

        log.debug("SQL create table request: {}", createTableSql);
        jdbcTemplate.execute(createTableSql);
        jdbcTemplate.execute(getExtensionTableRequest(targetSchema, extensionTable));
    }

    @Override
    public void create(ResourceQualifier rIdentifier) {

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

    private static boolean isGeometryExist(String createTableSql) {
        return createTableSql.contains("shape public.geometry");
    }

    @NotNull
    private static String handleChoice(@NotNull SimplePropertyDto attrDescription) {
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
    private static String generatePropertySqlString(@NotNull SimplePropertyDto attrDescription) {
        switch (attrDescription.getValueType()) {
            case INT:
                return attrDescription.getName() + " integer";
            case CHOICE:
                return handleChoice(attrDescription);
            case STRING:
                Integer maxLength = attrDescription.getMaxLength();
                if (maxLength < 255) {
                    maxLength = 255;
                }

                return attrDescription.getName() + " character varying(" + maxLength + ")";
            case DOUBLE:
                return attrDescription.getName() + " numeric(38,8)";
            case URL:
                return attrDescription.getName() + " text";
            case GEOMETRY:
                return "shape public.geometry";
            case DATETIME:
                return attrDescription.getName() + " timestamp";
            case LOOKUP:
                return attrDescription.getName() + " text";
            default:
                log.warn("Not supported attribute type: {}", attrDescription.getValueType());
        }

        return attrDescription.getName() + " character varying";
    }

    static String getExtensionTableRequest(String targetSchema, String extensionTable) {
        return "CREATE TABLE " + targetSchema + "." + extensionTable + " (" +
                "   object_id serial NOT NULL, " +
                "   violations jsonb, " +
                "   _xmin integer, " +
                "   valid boolean, " +
                "   class_id integer);" +
                "ALTER TABLE ONLY " + targetSchema + "." + extensionTable +
                "   ADD CONSTRAINT " + extensionTable + "_pkey PRIMARY KEY (object_id);";
    }
}
