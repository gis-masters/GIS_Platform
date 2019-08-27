package ru.mycrg.wrapper.dao;

import ru.mycrg.common.FeatureDescriptionDto;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.import_.ColumnProjection;
import ru.mycrg.common.import_.GeoMapping;
import ru.mycrg.common.import_.ImportMqTask;

import java.util.List;
import java.util.Map;

import static ru.mycrg.wrapper.dao.DaoProperties.*;

public class SqlGenerator {

    public static String prepareUpdateRequest(ResourceProjection target, Map<String, Object> item) {
        final String[] sql = {String.format("UPDATE %s.%s SET ", target.getSchemaName(), target.getTableName())};

        item.forEach((key, value) -> {
            if (!OBJECT_ID.equals(key)) {
                if (value.equals(DaoProperties.NULL_MARKER)) {
                    sql[0] = sql[0] + key + "=NULL, ";
                } else {
                    sql[0] = sql[0] + key + "='" + value + "', ";
                }
            }
        });

        return sql[0].substring(0, sql[0].length() - 2) + " WHERE objectid=" + item.get(OBJECT_ID);
    }

    public static String prepareAlterRequest(List<GeoMapping> mapping, String targetSchema, String targetTable) {
//        ALTER TABLE fiz.functionalzone ADD COLUMN IF NOT EXISTS fiz6 INTEGER,
//                                       ADD COLUMN IF NOT EXISTS fiz5 INTEGER,
//                                       ADD COLUMN IF NOT EXISTS fiz4 INTEGER;
        String alter = "ALTER TABLE " + targetSchema + "." + targetTable + " ";
        StringBuilder columns = new StringBuilder();

        for (GeoMapping geoMapping : mapping) {
            ColumnProjection target = geoMapping.getTarget();
            if (target.getType().equals(AS_IS)) {
                columns
                        .append("ADD COLUMN IF NOT EXISTS ")
                        .append(geoMapping.getSource().getName())
                        .append(" ")
                        .append(defineColumnType(geoMapping.getSource().getBinding()))
                        .append(", ");
            }
        }

        columns = new StringBuilder(columns.substring(0, columns.length() - 2));

        return alter + columns;
    }

    public static String prepareCreateTableRequest(ImportMqTask importTask) {
        FeatureDescriptionDto fDescription = importTask.getFeatureDescription();
        String targetSchema = importTask.getTargetResource().getSchemaName();
        String targetTable = importTask.getTargetResource().getTableName();
        Integer srsCode = importTask.getSrs();
        String target = targetSchema + "." + targetTable;

        String createTableSql = "CREATE TABLE " + target + " (";
        String attributesPart = "";


//        "objectid integer NOT NULL, " +
//        "classid integer, " +
//
//        // random atributes
//        "fz_mfstp smallint, " +
//        "fz_odstp smallint, " +
//        "fz_ingstp smallint, " +
//        "fz_trstp smallint, " +
//        "fz_shstp smallint, " +
//        "fz_recstp smallint, " +
//        "fz_orecstp smallint, " +
//        "area numeric(38,8), " +
//        "info_obj character varying(255), " +
//        "constr_den numeric(38,8), " +
//        "bld_height integer, " +
//        "pop_den numeric(38,8), " +
//        "population integer, " +
//        "hzrd_class integer, " +
//        "other character varying(255), " +
//        "event_time integer, " +
//        "status smallint, " +
//        "reg_status smallint, " +
//
//        "globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying, "

        String endPart = "shape public.geometry," +
                "ruleid character varying(20)" +
                "CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = " + srsCode + ")));" +
                "ALTER TABLE ONLY " + target + " ADD CONSTRAINT " + targetTable + "_pkey PRIMARY KEY (objectid);";

        return createTableSql;
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
