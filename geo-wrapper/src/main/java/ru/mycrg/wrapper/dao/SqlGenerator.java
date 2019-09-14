package ru.mycrg.wrapper.dao;

import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.import_.TargetAttribute;
import ru.mycrg.common.import_.MatchingPair;
import ru.mycrg.common.import_.ImportMqTask;

import java.util.List;
import java.util.Map;

import static ru.mycrg.wrapper.dao.DaoProperties.*;

public class SqlGenerator {

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

    public static String prepareAlterRequest(List<MatchingPair> mapping, String targetSchema, String targetTable) {
//        ALTER TABLE fiz.functionalzone ADD COLUMN IF NOT EXISTS fiz6 INTEGER,
//                                       ADD COLUMN IF NOT EXISTS fiz5 INTEGER,
//                                       ADD COLUMN IF NOT EXISTS fiz4 INTEGER;
        String alter = "ALTER TABLE " + targetSchema + "." + targetTable + " ";
        StringBuilder columns = new StringBuilder();

        for (MatchingPair matchingPair : mapping) {
            TargetAttribute target = matchingPair.getTarget();
            if (target.getType().equals(AS_IS)) {
                columns
                        .append("ADD COLUMN IF NOT EXISTS ")
                        .append(matchingPair.getSource().getName())
                        .append(" ")
                        .append(defineColumnType(matchingPair.getSource().getBinding()))
                        .append(", ");
            }
        }

        columns = new StringBuilder(columns.substring(0, columns.length() - 2));

        return alter + columns;
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
                .append(" integer NOT NULL, ");

        // Сначала добавим атрибуты которые есть в схеме
//        AtomicBoolean isGeometryExist = new AtomicBoolean(false);
//        importTask.getFeatureDescription().getProperties().forEach(propertySchema -> {
//            String name = propertySchema.getName().toLowerCase();
//            if (GLOBAL_ID.equals(name)) {
//                createTableSql
//                        .append("globalid character varying(38) " +
//                                "DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying, ");
//            } else {
//                switch (propertySchema.getValueType()) {
//                    case INT:
//                        createTableSql
//                                .append(name)
//                                .append(" integer, ");
//                        break;
//                    case STRING:
//                        Integer maxLength = propertySchema.getMaxLength();
//                        if (maxLength == -1) {
//                            maxLength = 255;
//                        }
//
//                        createTableSql
//                                .append(name)
//                                .append(" character varying(")
//                                .append(maxLength)
//                                .append("), ");
//                        break;
//                    case DOUBLE:
//                        createTableSql
//                                .append(name)
//                                .append(" numeric(38,8), ");
//                        break;
//                    case CHOICE:
//                        createTableSql
//                                .append(name)
//                                .append(" integer, ");
//                        break;
//                    case GEOMETRY:
//                        isGeometryExist.set(true);
//                    default:
//                }
//            }
//        });

        if (importTask.getPairs() != null) {
            importTask
                    .getPairs().stream()
                    .filter(matchingPair -> !NOT_IMPORT.equals(matchingPair.getTarget().getName()))
                    .forEach(matchingPair -> {
                        createTableSql
                                .append(matchingPair.getSource().getName())
                                .append(" ")
                                .append(defineColumnType(matchingPair.getSource().getBinding()))
                                .append(", ");
                    });
        }

//        if (isGeometryExist.get()) {
            createTableSql
                    .append("shape public.geometry, ")
                    .append("CONSTRAINT ")
                    .append(targetTable)
                    .append("_pkey PRIMARY KEY (")
                    .append(PRIMARY_KEY)
                    .append("), ")
                    .append("CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = ")
                    .append(srsCode)
                    .append("))); ");
//        } else {
//            createTableSql.delete(createTableSql.length() - 2, createTableSql.length());
//            createTableSql
//                    .append("); ")
//                    .append("ALTER TABLE ONLY ")
//                    .append(target)
//                    .append(" ADD CONSTRAINT ")
//                    .append(targetTable)
//                    .append("_pkey PRIMARY KEY (objectid);");
//        }

        return createTableSql.toString();
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

    private static String defineColumnType(String binding) {
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
