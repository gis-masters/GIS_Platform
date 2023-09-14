package ru.mycrg.data_service.dao.utils;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.util.filter.CrgFilter;
import ru.mycrg.data_service.util.filter.FilterCondition;
import ru.mycrg.data_service.util.filter.FilterItem;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ForeignKeyType;
import ru.mycrg.data_service_contract.enums.ValueType;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.geo_json.GeoJsonObject;

import java.util.List;
import java.util.Objects;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import static java.lang.String.format;
import static java.util.Objects.isNull;
import static ru.mycrg.data_service.dao.config.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;
import static ru.mycrg.data_service.dao.config.DaoProperties.PRIMARY_KEY;
import static ru.mycrg.data_service.util.CrsHandler.extractCrsNumber;
import static ru.mycrg.data_service.util.StringUtil.join;
import static ru.mycrg.data_service_contract.enums.ValueType.CHOICE;
import static ru.mycrg.data_service_contract.enums.ValueType.STRING;

public class SqlBuilder {

    private static final Logger log = LoggerFactory.getLogger(SqlBuilder.class);

    private SqlBuilder() {
        throw new IllegalStateException("Utility class");
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
    public static String buildGeometryValue(Feature feature) {
        GeoJsonObject geometry = feature.getGeometry();
        if (geometry != null) {
            String crs = "EPSG:28406";
            String featureSrs = feature.getSrs();
            if (featureSrs != null) {
                crs = featureSrs;
            }

            geometry.setSrs(featureSrs);

            return "public.st_transform(" +
                    "  public.st_geomFromGeoJSON('" + geometry + "')," +
                    "  " + extractCrsNumber(crs) +
                    ")";
        }

        return "";
    }

    @NotNull
    public static String buildParameterizedInsertQuery(@NotNull ResourceQualifier qualifier,
                                                       @NotNull Feature feature,
                                                       boolean withLastVal) {
        String insertQuery = "INSERT INTO " + qualifier.getTableQualifier();
        StringBuilder params = new StringBuilder();
        StringBuilder values = new StringBuilder(" VALUES (");
        String lastValSection = " returning lastval()";

        GeoJsonObject geometry = feature.getGeometry();
        if (geometry != null) {
            params.append(DEFAULT_GEOMETRY_COLUMN_NAME).append(", ");
            values.append(buildGeometryValue(feature)).append(", ");
        }

        feature.getProperties().forEach((paramName, value) -> {
            params.append(paramName).append(", ");

            values.append(":").append(paramName.trim()).append(", ");
        });

        String valueSection = values.substring(0, values.length() - 2) + ")";
        String paramSection = " (" + params.substring(0, params.length() - 2) + ")";

        return withLastVal
                ? insertQuery + paramSection + valueSection + lastValSection
                : insertQuery + paramSection + valueSection;
    }

    @NotNull
    public static String buildParameterizedUpdateQuery(@NotNull ResourceQualifier qualifier,
                                                       @NotNull Feature feature,
                                                       @NotNull String primaryKey,
                                                       @NotNull List<Long> recordIds) {
        String whereSection = " WHERE (" + primaryKey + " in (" + join(recordIds) + "))";

        return prepareUpdateQuery(feature, qualifier, whereSection);
    }

    @NotNull
    public static String buildParameterizedBatchUpdateQuery(ResourceQualifier qualifier,
                                                            Feature feature,
                                                            String primaryKey) {
        String whereSection = String.format(" WHERE %s = :%s ", primaryKey, primaryKey);

        return prepareUpdateQuery(feature, qualifier, whereSection);
    }

    @NotNull
    public static String buildCopyQuery(String sourceTable, String targetTable, SchemaDto sourceSchema,
                                        SchemaDto targetSchema, List<Long> featureIds) {
        String insertTo = "INSERT INTO " + targetTable;
        String data = mappingColumns(sourceSchema, targetSchema);
        String from = " FROM " + sourceTable;
        String where = format(" WHERE %s IN (%s)", PRIMARY_KEY, join(featureIds));
        String returnIds = format(" RETURNING %s;", PRIMARY_KEY);

        return insertTo + data + from + where + returnIds;
    }

    @NotNull
    public static String buildCopyGeometryQuery(ResourceQualifier sourceTable, ResourceQualifier targetTable) {
        String insertTo = "INSERT INTO " + targetTable.getQualifier();
        String shapeCopy = "(shape) SELECT \"wkb_geometry\"";

        String from = " FROM " + sourceTable.getQualifier();

        return String.format("WITH rows AS (%s RETURNING 1) SELECT count(*) FROM rows;", insertTo + shapeCopy + from);
    }

    @NotNull
    public static String buildGetGeometryTypeQuery(ResourceQualifier table, String geometryField) {
        return String.format("SELECT public.st_geometrytype(%s) FROM %s LIMIT 1;", geometryField, table.getQualifier());
    }

    @NotNull
    public static String buildDeleteTableQuery(ResourceQualifier table) {
        return String.format("DROP TABLE IF EXISTS %s;", table.getQualifier());
    }

    @NotNull
    public static String generatePropertySqlString(@NotNull SimplePropertyDto attrDescription) {
        String result;
        switch (attrDescription.getValueTypeAsEnum()) {
            case INT:
                result = attrDescription.getName() + " integer";
                break;
            case USER_ID:
            case LONG:
                result = attrDescription.getName() + " bigint";
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
            case USER:
            case URL:
            case TEXT:
            case LOOKUP:
                result = attrDescription.getName() + " text";
                break;
            case GEOMETRY:
                result = "shape public.geometry";
                break;
            case DATETIME:
                result = attrDescription.getName() + " timestamp";
                break;
            case VERSIONS:
            case FILE:
                result = attrDescription.getName() + " jsonb";
                break;
            case BOOLEAN:
                Object defaultValue = attrDescription.getDefaultValue();
                if (Objects.isNull(defaultValue)) {
                    result = attrDescription.getName() + " boolean";
                    break;
                }

                boolean parseBoolean = Boolean.parseBoolean(defaultValue.toString());
                result = attrDescription.getName() + " boolean default " + parseBoolean;
                break;
            case UUID:
                result = attrDescription.getName() + " uuid";
                break;
            default:
                log.warn("Not supported attribute type: {}", attrDescription.getValueTypeAsEnum());

                result = attrDescription.getName() + " character varying";
        }

        return result;
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

    private static String mappingColumns(SchemaDto sourceSchema, SchemaDto targetSchema) {
        String pre = " (";
        String post = ") ";
        List<SimplePropertyDto> sourceProps = sourceSchema.getProperties();
        List<SimplePropertyDto> targetProps = targetSchema.getProperties();

        StringBuilder targetColumns = new StringBuilder();
        StringBuilder sourceColumns = new StringBuilder("SELECT ");

        for (SimplePropertyDto sourceProperty: sourceProps) {
            String sourceName = sourceProperty.getName().toLowerCase();
            ValueType sourceValueType = sourceProperty.getValueTypeAsEnum();

            List<SimplePropertyDto> filteredProps = targetProps
                    .stream()
                    .filter(equalByName(sourceName))
                    .filter(notCalculatedProperty())
                    .filter(compatibleByType(sourceValueType))
                    .collect(Collectors.toList());

            if (!filteredProps.isEmpty()) {
                targetColumns.append(sourceName).append(", ");
                sourceColumns.append("\"").append(sourceName).append("\", ");
            }
        }

        targetColumns = new StringBuilder(pre + targetColumns.substring(0, targetColumns.length() - 2) + post);
        sourceColumns = new StringBuilder(sourceColumns.substring(0, sourceColumns.length() - 2));

        return targetColumns + sourceColumns.toString();
    }

    @NotNull
    private static Predicate<SimplePropertyDto> equalByName(String sourceName) {
        return targetProperty -> targetProperty.getName().equalsIgnoreCase(sourceName);
    }

    @NotNull
    private static Predicate<SimplePropertyDto> notCalculatedProperty() {
        return prop -> {
            String formula = prop.getCalculatedValueWellKnownFormula();

            return isNull(formula) || formula.isEmpty();
        };
    }

    @NotNull
    private static Predicate<SimplePropertyDto> compatibleByType(ValueType sourceValueType) {
        return prop -> {
            ValueType targetType = prop.getValueTypeAsEnum();
            if (targetType.equals(STRING)) {
                return true;
            }

            if (sourceValueType.equals(STRING) && targetType.equals(CHOICE)) {
                return true;
            }

            return targetType.equals(sourceValueType);
        };
    }

    private static String getProperty(String property) {
        if (property.equalsIgnoreCase("createdAt")) {
            return "created_at";
        }

        return property;
    }

    private static String prepareUpdateQuery(Feature feature, ResourceQualifier qualifier, String whereSection) {
        StringBuilder setPart = new StringBuilder();
        GeoJsonObject geometry = feature.getGeometry();

        if (geometry != null) {
            setPart.append(DEFAULT_GEOMETRY_COLUMN_NAME).append(" = ")
                   .append(buildGeometryValue(feature)).append(", ");
        }

        feature.getProperties().forEach((paramName, value) -> {
            setPart.append(paramName).append(" = ")
                   .append(":").append(paramName.trim()).append(", ");
        });

        if (setPart.length() > 0) {
            String setPartSection = setPart.substring(0, setPart.length() - 2);

            String updateQuery = "UPDATE " + qualifier.getTableQualifier() + " SET ";

            return updateQuery + setPartSection + whereSection;
        } else {
            return "";
        }
    }
}
