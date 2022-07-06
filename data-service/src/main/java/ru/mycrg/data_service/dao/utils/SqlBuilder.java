package ru.mycrg.data_service.dao.utils;

import com.healthmarketscience.sqlbuilder.CustomCondition;
import com.healthmarketscience.sqlbuilder.InsertQuery;
import com.healthmarketscience.sqlbuilder.UpdateQuery;
import com.healthmarketscience.sqlbuilder.dbspec.basic.DbColumn;
import com.healthmarketscience.sqlbuilder.dbspec.basic.DbSchema;
import com.healthmarketscience.sqlbuilder.dbspec.basic.DbSpec;
import com.healthmarketscience.sqlbuilder.dbspec.basic.DbTable;
import org.geotools.data.jdbc.FilterToSQL;
import org.geotools.data.jdbc.FilterToSQLException;
import org.geotools.data.postgis.PostGISDialect;
import org.geotools.data.postgis.PostgisFilterToSQL;
import org.geotools.filter.text.cql2.CQLException;
import org.geotools.filter.text.ecql.ECQL;
import org.jetbrains.annotations.NotNull;
import org.opengis.filter.Filter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.util.filter.CrgFilter;
import ru.mycrg.data_service.util.filter.FilterCondition;
import ru.mycrg.data_service.util.filter.FilterItem;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.geo_json.GeoJsonObject;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.dao.config.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;
import static ru.mycrg.data_service.dao.config.DaoProperties.PRIMARY_KEY;
import static ru.mycrg.data_service.util.CrsHandler.extractCrsNumber;

public class SqlBuilder {

    private static final Logger log = LoggerFactory.getLogger(SqlBuilder.class);

    private SqlBuilder() {
        throw new IllegalStateException("Utility class");
    }

    public static String buildWhereSection(String ecqlFilter) {
        try {
            if (ecqlFilter == null || ecqlFilter.isBlank()) {
                return "";
            }

            Filter filter = ECQL.toFilter(ecqlFilter);
            FilterToSQL encoder = new PostgisFilterToSQL(new PostGISDialect(null));
            // encoder.setInline(true); // don't adding WHERE

            return encoder.encodeToString(filter);
        } catch (CQLException | FilterToSQLException e) {
            String msg = String.format("Задан некорректный ECQL фильтр: [%s]", ecqlFilter);
            log.error("{} Reason: [{}]", msg, e.getMessage());

            throw new BadRequestException(msg);
        }
    }

    public static String fillWhereSectionByFilter(CrgFilter filter) {
        StringBuilder result = new StringBuilder();
        for (FilterItem filterItem: filter.getFilters()) {
            String name = filterItem.getField();
            String value = filterItem.getValue();
            FilterCondition condition = filterItem.getCondition();

            if (condition.equals(FilterCondition.EQUAL_TO)) {
                if (!value.isEmpty()) {
                    result.append(" AND ")
                          .append(name)
                          .append(" = '")
                          .append(value)
                          .append("' ");
                }
            } else if (condition.equals(FilterCondition.IS_NULL)) {
                result.append(" AND ")
                      .append(name)
                      .append(" is null ");
            } else if (condition.equals(FilterCondition.LIKE)) {
                if (!value.isEmpty()) {
                    result.append(" AND lower(")
                          .append(name)
                          .append(") LIKE lower('%")
                          .append(value)
                          .append("%') ");
                }
            } else {
                log.warn("Unsupported FilterCondition: {}", condition);
            }
        }

        return result.toString();
    }

    public static String buildInSection(Collection<String> ids) {
        List<String> asString = ids.stream()
                                   .map(s -> "'" + s + "'")
                                   .collect(Collectors.toList());

        return String.join(",", asString);
    }

    @NotNull
    public static String buildOrderBySection(Sort sort) {
        if (sort.isUnsorted()) {
            return "";
        }

        List<String> orderItems = sort.stream()
                                      .map(order -> getProperty(order.getProperty()) + " " + order.getDirection())
                                      .collect(Collectors.toList());

        return " ORDER BY " + String.join(",", orderItems) + " ";
    }

    @NotNull
    public static String generateInsertQuery(ResourceQualifier qualifier, Feature feature) {
        String crs = "EPSG:28406";
        if (feature.getSrs() != null) {
            crs = feature.getSrs();
        }

        DbTable table = getSimpleDbTable(qualifier);
        DbColumn geometryColumn = table.addColumn(DEFAULT_GEOMETRY_COLUMN_NAME);

        InsertQuery insertQuery = new InsertQuery(table);
        insertQuery.addCustomColumn(geometryColumn, "GEO_VALUE_TEMPLATE");

        Map<String, Object> properties = feature.getProperties();
        if (properties != null) {
            properties.forEach((key, value) -> {
                DbColumn dbColumn = table.addColumn(key);

                insertQuery.addColumn(dbColumn, value);
            });
        }

        GeoJsonObject geometry = feature.getGeometry();
        if (geometry != null) {
            geometry.setSrs(feature.getSrs());
        }

        String transformTemplate = "public.st_transform(" +
                "  public.st_geomFromGeoJSON('" + geometry + "')," +
                "  " + extractCrsNumber(crs) +
                ")";

        String query = insertQuery.validate().toString()
                                  .replace("'GEO_VALUE_TEMPLATE'", transformTemplate);

        return String.format("%s returning lastval();", query);
    }

    @NotNull
    public static String generateUpdateQuery(ResourceQualifier qualifier, Feature feature) {
        DbTable table = getSimpleDbTable(qualifier);

        UpdateQuery updateQuery = new UpdateQuery(table);
        updateQuery.addCondition(new CustomCondition(String.format("%s = %d", PRIMARY_KEY, qualifier.getRecord())));

        feature.getProperties().forEach((key, value) -> {
            updateQuery.addSetClause(table.addColumn(key), value);
        });

        String query = updateQuery.validate().toString();

        GeoJsonObject geometry = feature.getGeometry();
        if (geometry != null) {
            String template = "GEO_VALUE_TEMPLATE";
            DbColumn geometryColumn = table.addColumn(DEFAULT_GEOMETRY_COLUMN_NAME);
            updateQuery.addCustomSetClause(geometryColumn, template);

            String crs = "EPSG:28406";
            String featureSrs = feature.getSrs();
            if (featureSrs != null) {
                crs = featureSrs;
            }

            geometry.setSrs(featureSrs);

            String transformTemplate = "public.st_transform(" +
                    "  public.st_geomFromGeoJSON('" + geometry + "')," +
                    "  " + extractCrsNumber(crs) +
                    ")";

            query = query.replace("'" + template + "'", transformTemplate);
        }

        return query;
    }

    public static DbTable getSimpleDbTable(@NotNull ResourceQualifier rQualifier) {
        DbSpec spec = new DbSpec();
        DbSchema dbSchema = spec.addSchema(rQualifier.getSchema());

        return dbSchema.addTable(rQualifier.getTable());
    }

    private static String getProperty(String property) {
        if (property.equalsIgnoreCase("createdAt")) {
            return "created_at";
        }

        return property;
    }
}
