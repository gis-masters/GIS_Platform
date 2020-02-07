package ru.mycrg.wrapper.dao;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.mq_queue_contract.SchemaDto;
import ru.mycrg.mq_queue_contract.ResourceProjection;
import ru.mycrg.mq_queue_contract.SimplePropertyDto;
import ru.mycrg.mq_queue_contract.import_.ImportMqTask;

import java.util.List;
import java.util.Map;

import static ru.mycrg.wrapper.dao.DaoProperties.AS_IS;
import static ru.mycrg.wrapper.dao.DaoProperties.PRIMARY_KEY;

public class SqlGenerator {

    private static final Logger log = LoggerFactory.getLogger(SqlGenerator.class);

    public static String prepareUpdateRequest(ResourceProjection target, Map<String, Object> item) {
        final String[] sql = {String.format("UPDATE %s.%s SET ", target.getSchemaName(), target.getTableName())};

        item.forEach((key, value) -> {
            if (!PRIMARY_KEY.equals(key)) {
                if (DaoProperties.NULL_MARKER.equals(value)) {
                    sql[0] = sql[0] + key + "=NULL, ";
                } else {
                    sql[0] = sql[0] + key + "='" + value + "', ";
                }
            }
        });

        return sql[0].substring(0, sql[0].length() - 2) + " WHERE objectid=" + item.get(PRIMARY_KEY);
    }

    @NotNull
    public static String prepareCreateTableRequest(@NotNull ImportMqTask importTask) {
        SchemaDto featureDescription = importTask.getFeatureDescription();
        assert featureDescription != null;

        ResourceProjection targetResource = importTask.getTargetResource();
        assert targetResource != null;

        String targetSchema = targetResource.getSchemaName();
        String targetTable = targetResource.getTableName();
        Integer srsCode = importTask.getSrs();
        String target = targetSchema + "." + targetTable;

        StringBuilder createTableSql = new StringBuilder();
        createTableSql
                .append("CREATE TABLE ")
                .append(target)
                .append(" (")
                .append(PRIMARY_KEY)
                .append(" integer NOT NULL");

        // Атрибуты по схеме
        featureDescription.getProperties().forEach(propertyDto -> {
            createTableSql
                    .append(", ")
                    .append(generatePropertySqlString(propertyDto));
        });

        // Атрибуты "AsIs"
        importTask
                .getPairs().stream()
                .filter(mPair -> AS_IS.equals(mPair.getTarget().getType()))
                .filter(mPair -> !PRIMARY_KEY.equals(mPair.getTarget().getName().toLowerCase()))
                .filter(mPair -> isNotExistInSchema(featureDescription.getProperties(), mPair.getTarget().getName()))
                .forEach(mPair -> {
                    if ("the_geom".equals(mPair.getSource().getName().toLowerCase())) {
                        createTableSql.append(", shape public.geometry");
                    } else {
                        createTableSql
                                .append(", ")
                                .append(mPair.getSource().getName())
                                .append(" ")
                                .append(defineSourceAttributeType(mPair.getSource().getBinding()));
                    }
                });

        // Add PRIMARY_KEY CONSTRAINT
        createTableSql
                .append(");")
                .append(" ALTER TABLE ONLY ")
                .append(target)
                .append(" ADD CONSTRAINT ")
                .append(targetTable)
                .append("_pkey PRIMARY KEY (")
                .append(PRIMARY_KEY)
                .append(");");

        // Add GEOMETRY CONSTRAINT
        if (isGeometryExist(createTableSql)) {
            createTableSql
                    .append(" ALTER TABLE ONLY ")
                    .append(target)
                    .append(" ADD CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = ")
                    .append(srsCode)
                    .append("));");
        }

        return createTableSql.toString();
    }

    static String getExtensionTableRequest(String targetSchema, String extensionTable) {
        return "CREATE TABLE " + targetSchema + "." + extensionTable + " (" +
                "   object_id integer NOT NULL, " +
                "   violations jsonb, " +
                "   _xmin integer, " +
                "   valid boolean, " +
                "   class_id integer);" +
                "ALTER TABLE ONLY " + targetSchema + "." + extensionTable +
                "   ADD CONSTRAINT " + extensionTable + "_pkey PRIMARY KEY (object_id);";
    }

    static String getSequenceRequest(String target) {
        return "CREATE SEQUENCE " + target + "_objectid_seq" +
                "    AS integer " +
                "    START WITH 1 " +
                "    INCREMENT BY 1 " +
                "    NO MINVALUE " +
                "    NO MAXVALUE " +
                "    CACHE 1; ";
    }

    private static boolean isNotExistInSchema(@NotNull List<SimplePropertyDto> properties, String attrName) {
        return properties.stream()
                .noneMatch(propertyDto -> propertyDto.getName().toLowerCase().equals(attrName.toLowerCase()));
    }

    private static boolean isGeometryExist(StringBuilder createTableSql) {
        return createTableSql.toString().contains("shape public.geometry");
    }

    @NotNull
    private static String generatePropertySqlString(@NotNull SimplePropertyDto attrDescription) {
        switch (attrDescription.getValueType()) {
            case INT:
            case CHOICE:
                return attrDescription.getName() + " integer";
            case STRING:
                Integer maxLength = attrDescription.getMaxLength();
                if (maxLength < 255) {
                    maxLength = 255;
                }

                return attrDescription.getName() + " character varying(" + maxLength + ")";
            case DOUBLE:
                return attrDescription.getName() + " numeric(38,8)";
            case URL:
                return attrDescription.getName() + " character varying(255)";
            case GEOMETRY:
                return "shape public.geometry";
            default:
                log.warn("Not supported attribute type: {}", attrDescription.getValueType());
        }

        return "";
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
