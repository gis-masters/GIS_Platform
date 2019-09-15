package ru.mycrg.wrapper.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.common.FeatureDescriptionDto;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.SimplePropertyDto;
import ru.mycrg.common.enums.ValueType;
import ru.mycrg.common.import_.ImportMqTask;
import ru.mycrg.common.import_.MatchingPair;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static ru.mycrg.wrapper.dao.DaoProperties.*;

public class SqlGenerator {

    private static final Logger log = LoggerFactory.getLogger(SqlGenerator.class);

    public static String prepareUpdateRequest(ResourceProjection target, Map<String, Object> item) {
        final String[] sql = {String.format("UPDATE %s.%s SET ", target.getSchemaName(), target.getTableName())};

        item.forEach((key, value) -> {
            if (!PRIMARY_KEY.equals(key)) {
                if (value.equals(DaoProperties.NULL_MARKER)) {
                    sql[0] = sql[0] + key + "=NULL, ";
                } else {
                    sql[0] = sql[0] + key + "='" + value + "', ";
                }
            }
        });

        return sql[0].substring(0, sql[0].length() - 2) + " WHERE objectid=" + item.get(PRIMARY_KEY);
    }

    public static String prepareCreateTableRequest(ImportMqTask importTask) {
        String targetSchema = importTask.getTargetResource().getSchemaName();
        String targetTable = importTask.getTargetResource().getTableName();
        Integer srsCode = importTask.getSrs();
        String target = targetSchema + "." + targetTable;

        StringBuilder createTableSql = new StringBuilder();
        createTableSql
                .append("CREATE TABLE ")
                .append(target)
                .append(" (")
                .append(PRIMARY_KEY)
                .append(" integer NOT NULL");

        importTask
                .getPairs()
                .forEach(mPair -> addAttribute(mPair, createTableSql, importTask.getFeatureDescription()));

        if (isGeometryExist(importTask.getFeatureDescription().getProperties())) {
            createTableSql
                    .append(", ")
                    .append("shape public.geometry, ")
                    .append("CONSTRAINT ")
                    .append(targetTable)
                    .append("_pkey PRIMARY KEY (")
                    .append(PRIMARY_KEY)
                    .append("), ")
                    .append("CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = ")
                    .append(srsCode)
                    .append(")));");
        } else {
            createTableSql
                    .append("); ")
                    .append("ALTER TABLE ONLY ")
                    .append(target)
                    .append(" ADD CONSTRAINT ")
                    .append(targetTable)
                    .append("_pkey PRIMARY KEY (objectid);");
        }

        return createTableSql.toString();
    }

    private static boolean isGeometryExist(List<SimplePropertyDto> properties) {
        return properties.stream()
                .anyMatch(propertyDto -> propertyDto.getValueType().equals(ValueType.GEOMETRY));
    }

    private static void addAttribute(MatchingPair matchingPair,
                                     StringBuilder createTableSql,
                                     FeatureDescriptionDto featureDescription) {
        String targetName = matchingPair.getTarget().getName();
        Optional<SimplePropertyDto> byName = featureDescription.getProperties().stream()
                .filter(propertyDto -> propertyDto.getName().equals(targetName))
                .findFirst();

        if (byName.isPresent()) {
            if (byName.get().getValueType().equals(ValueType.GEOMETRY)) {
                return;
            }
        }

        switch (matchingPair.getTarget().getType()) {
            case AS_IS:
                createTableSql
                        .append(", ")
                        .append(matchingPair.getSource().getName())
                        .append(" ")
                        .append(defineSourceAttributeType(matchingPair.getSource().getBinding()));
                break;

            case FromSchema:
                if (byName.isPresent()) {
                    createTableSql
                            .append(", ")
                            .append(targetName.toLowerCase())
                            .append(" ")
                            .append(defineTargetAttributeType(byName.get(), targetName));
                } else {
                    log.warn("Attribute '{}' not found in schema", targetName);
                }

                break;
            default:
                log.warn("Not supported target type: {}", matchingPair.getTarget().getType());
        }
    }

    private static String defineTargetAttributeType(SimplePropertyDto attrDescription, String targetAttrName) {
        switch (attrDescription.getValueType()) {
            case INT:
            case CHOICE:
                return "integer";
            case STRING:
                Integer maxLength = attrDescription.getMaxLength();
                if (maxLength == -1) {
                    maxLength = 255;
                }

                return "character varying(" + maxLength + ")";
            case DOUBLE:
                return "numeric(38,8)";
            case GEOMETRY:
                // Геометрию тут игнорим (обрабатывается в конце)
                break;
            default:
                log.warn("Not supported attribute type: {}", attrDescription.getValueType());
        }

        return "";
    }

    public static String getExtensionTableRequest(String targetSchema, String extensionTable) {
        return "CREATE TABLE " + targetSchema + "." + extensionTable + " (" +
                "   object_id integer NOT NULL, " +
                "   violations jsonb, " +
                "   _xmin integer, " +
                "   valid boolean, " +
                "   class_id integer);" +
                "ALTER TABLE ONLY " + targetSchema + "." + extensionTable +
                "   ADD CONSTRAINT " + extensionTable + "_pkey PRIMARY KEY (object_id);";
    }

    public static String getSequenceRequest(String target) {
        return "CREATE SEQUENCE " + target + "_objectid_seq" +
                "    AS integer " +
                "    START WITH 1 " +
                "    INCREMENT BY 1 " +
                "    NO MINVALUE " +
                "    NO MAXVALUE " +
                "    CACHE 1; ";
    }

    private static String defineSourceAttributeType(String binding) {
        // TODO

        if (binding.contains("Double")) {
            return "numeric";
        }

        if (binding.contains("Integer")) {
            return "integer";
        }

        return "varchar";
    }
}
