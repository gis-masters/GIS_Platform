package ru.mycrg.data_service.dao.utils;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import ru.mycrg.data_service.dto.RegistryData;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.util.filter.CrgFilter;
import ru.mycrg.data_service.util.filter.FilterCondition;
import ru.mycrg.data_service.util.filter.FilterItem;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ForeignKeyType;
import ru.mycrg.data_service_contract.enums.ValueType;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.geo_json.GeoJsonObject;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;
import static ru.mycrg.data_service.dao.config.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;
import static ru.mycrg.data_service.dao.config.DaoProperties.PRIMARY_KEY;
import static ru.mycrg.data_service.dao.utils.EcqlHandler.buildWhereSection;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;
import static ru.mycrg.data_service.service.schemas.SchemaUtil.*;
import static ru.mycrg.data_service.util.CrsHandler.extractCrsNumber;
import static ru.mycrg.data_service.util.EcqlFilterUtil.addAsEqual;
import static ru.mycrg.data_service.util.StringUtil.join;
import static ru.mycrg.data_service.util.StringUtil.joinAndQuoteMark;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.IS_DELETED;

public class SqlBuilder {

    private static final Logger log = LoggerFactory.getLogger(SqlBuilder.class);

    private SqlBuilder() {
        throw new IllegalStateException("Utility class");
    }

    public static String buildCopyDataToFtsLayersQuery(ResourceQualifier qualifier,
                                                       List<String> properties) {
        boolean isLibrary = qualifier.getType().equals(LIBRARY);

        String ftsTable = "fts_layers";
        if (isLibrary) {
            ftsTable = "fts_documents";
        }

        StringBuilder query = new StringBuilder();
        query.append("INSERT INTO data.").append(ftsTable).append("(schema, \"table\", id, ")
             .append(isLibrary ? "path," : "")
             .append(" concatenated_data) ").append("SELECT ")
             .append("'").append(qualifier.getSchema()).append("' AS schema, ")
             .append("'").append(qualifier.getTable()).append("' AS \"table\", ")
             .append(qualifier.getPrimaryKeyName()).append("::bigint AS id, ");

        if (isLibrary) {
            query.append("path AS path,");
        }

        IntStream.range(0, properties.size()).forEach(i -> {
            query.append("COALESCE(").append(properties.get(i)).append("::text, '')");
            if (i < properties.size() - 1) {
                query.append(" || ' ' || ");
            }
        });

        query.append(" AS concatenated_data FROM ").append(qualifier.getTableQualifier())
             .append(" ON CONFLICT (schema, \"table\", id) DO NOTHING");

        return query.toString();
    }

    @NotNull
    public static String buildFindAllowedForRegistryQuery(ResourceQualifier qualifier,
                                                          String ecqlFilter,
                                                          @Nullable RegistryData registryData) {
        return buildFindAllowedForRegistryQuery(qualifier, ecqlFilter, registryData, null);
    }

    @NotNull
    public static String buildFindAllowedForRegistryQuery(ResourceQualifier qualifier,
                                                          String ecqlFilter,
                                                          @Nullable RegistryData registryData,
                                                          @Nullable Pageable pageable) {
        String patchedFilter = ecqlFilter != null && ecqlFilter.toLowerCase().contains(IS_DELETED.getName())
                ? ecqlFilter
                : addAsEqual(ecqlFilter, IS_DELETED.getName(), "false");

        String byPermissionsSection = "";
        if (registryData != null) {
            String byAllowedDirectlySection = "";
            if (!registryData.getAllowedDirectlyDocumentIds().isEmpty()) {
                byAllowedDirectlySection = String.format(" id IN (%s) ",
                                                         joinAndQuoteMark(
                                                                 registryData.getAllowedDirectlyDocumentIds()));
            }

            String byChildrenSection = "";
            if (!registryData.getChildrenPaths().isEmpty()) {
                byChildrenSection = String.format(" OR path LIKE ANY (array[ %s ])",
                                                  joinAndQuoteMark(registryData.getChildrenPaths()));
            }

            String byParentSection = "";
            if (!registryData.getParentPaths().isEmpty()) {
                byParentSection = String.format(" OR path IN (%s)", joinAndQuoteMark(registryData.getParentPaths()));
            }

            if (!(byAllowedDirectlySection.isBlank() && byChildrenSection.isBlank() && byParentSection.isBlank())) {
                byPermissionsSection = "(" +
                        "   " + byAllowedDirectlySection +
                        "   " + byChildrenSection +
                        "   " + byParentSection +
                        ")";
            }

            if (!byPermissionsSection.isBlank()) {
                byPermissionsSection = byPermissionsSection + " AND ";
            }
        }

        String ecqlFiltersSection = buildWhereSection(patchedFilter);
        if (!ecqlFiltersSection.isBlank()) {
            ecqlFiltersSection = ecqlFiltersSection.replace("WHERE", "");
        }

        String orderSection = "";
        if (pageable != null) {
            Sort sort = pageable.getSort();
            if (sort.isUnsorted()) {
                sort = sort.and(Sort.by(qualifier.getPrimaryKeyName()));
            }

            orderSection = buildOrderBySection(sort);
        }

        String pagingSection = "";
        if (pageable != null) {
            pagingSection = String.format(" OFFSET %d LIMIT %d", pageable.getOffset(), pageable.getPageSize());
        }

        return "  SELECT * " +
                " FROM " + qualifier.getTableQualifier() +
                " WHERE " +
                "   (" +
                "     " + byPermissionsSection +
                "     " + ecqlFiltersSection +
                "   )" +
                " " + orderSection + pagingSection;
    }

    @NotNull
    public static String buildFindAllowedQuery(String parent,
                                               String ecqlFilter,
                                               ResourceQualifier qualifier,
                                               List<String> allPrincipalIds) {
        String tableQualifier = qualifier.getTableQualifier();
        String tableName = qualifier.getTable();

        return "SELECT n2.* FROM " +
                "  (" +
                "    SELECT res.id AS allowed_res_id " +
                "    FROM " + tableQualifier + " AS res " +
                "      JOIN data.acl_permissions AS p ON p.resource_id = res.id " +
                "      AND p.resource_table = '" + tableName + "' " +
                "      AND p.principal_id IN (" + joinAndQuoteMark(allPrincipalIds) + ") " +
                "      AND res.path = '" + parent + "' " +
                " " +
                "    UNION " +
                " " +
                "    SELECT SPLIT_PART(regexp_replace(path, '" + parent + "/', ''), '/', 1)::bigint as allowed_res_id " +
                "    FROM " + tableQualifier + " AS res " +
                "      JOIN data.acl_permissions AS p ON p.resource_id = res.id " +
                "      AND p.resource_table = '" + tableName + "' " +
                "      AND p.principal_id IN (" + joinAndQuoteMark(allPrincipalIds) + ") " +
                "      AND res.path LIKE '" + parent + "/%' " +
                "    GROUP BY allowed_res_id" +
                "  ) AS n1 " +
                "  JOIN " + tableQualifier + " AS n2 ON n1.allowed_res_id = n2.id " +
                " " + buildWhereSection(ecqlFilter);
    }

    @NotNull
    public static String buildFtsLayersQuery(@Nullable List<String> requestedTables,
                                             @NotNull Set<String> words,
                                             @Nullable Pageable pageable) {
        String pQuery = "";
        if (pageable != null) {
            pQuery = " OFFSET " + pageable.getOffset() + " LIMIT " + pageable.getPageSize();
        }

        return buildFtsDocumentsQuery("fts_layers", null, requestedTables, words) + pQuery;
    }

    @NotNull
    public static String buildFtsDocumentsQuery(String ecqlFilter,
                                                @Nullable List<String> requestedTables,
                                                @NotNull Set<String> words) {
        return buildFtsDocumentsQuery("fts_documents", ecqlFilter, requestedTables, words);
    }

    @NotNull
    public static String buildCadastrNumberQuery(ResourceQualifier qualifier,
                                                 List<String> resources,
                                                 @Nullable String ecqlFilter,
                                                 Pageable pageable) {
        String whereSection = buildWhereSection(ecqlFilter);
        if (whereSection.isBlank()) {
            whereSection = "WHERE concatenated_data LIKE :searchedText";
        } else {
            whereSection = whereSection + " AND concatenated_data LIKE :searchedText";
        }

        if (!resources.isEmpty()) {
            List<String> asString = resources.stream()
                                             .map(s -> "'" + s + "'")
                                             .collect(Collectors.toList());

            whereSection = whereSection + " AND \"table\" IN (" + String.join(",", asString) + ")";
        }

        String pageSection = "";
        if (pageable != null) {
            pageSection = " OFFSET " + pageable.getOffset() + " LIMIT " + pageable.getPageSize();
        }

        String subSelect = "SELECT * FROM " + qualifier.getTableQualifier() + " " + whereSection;

        return "SELECT :searchedText OPERATOR (public.<<<->) subquery.concatenated_data as dist, " +
                "      subquery.schema," +
                "      subquery.table," +
                "      subquery.id, " +
                "      subquery.concatenated_data " +
                "FROM " +
                "  (" +
                "    " + subSelect +
                "  ) AS subquery " +
                "ORDER BY dist " +
                pageSection;
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
    public static String buildSearchByDictionaryQuery(@NotNull Integer limit, @Nullable Integer type) {
        String typeSection = "";
        if (type != null) {
            typeSection = "AND type_id = " + type;
        }

        return "SELECT wd.dist, d.* " +
                "FROM ( " +
                "        SELECT word, type_id, word OPERATOR (public.<->) :searchedText as dist " +
                "        FROM data.fts_dictionary " +
                "    ) AS wd " +
                "    JOIN data.fts_dictionary AS d ON wd.word = d.word AND wd.type_id = d.type_id " +
                "WHERE wd.dist < 0.9 " + typeSection +
                "ORDER BY wd.dist LIMIT " + limit;
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

        Set<String> excludedValues = Set.of(qualifier.getPrimaryKeyName());
        feature.getProperties().entrySet().stream()
               .filter(entry -> !excludedValues.contains(entry.getKey()))
               .forEach(entry -> {
                   params.append(entry.getKey()).append(", ");
                   values.append(":").append(entry.getKey().trim()).append(", ");
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

    public static String buildHeadlinesQuery(String baseWord,
                                             Set<String> words) {
        String values = words.stream()
                             .map(word -> "('" + word + "')")
                             .collect(Collectors.joining(", "));

        return " WITH temp_table AS (" +
                "    VALUES " + values +
                ") " +
                "SELECT " +
                "    column1 AS data, " +
                "    column1::text OPERATOR (public.<->) '" + baseWord + "'::text AS dist " +
                "FROM temp_table " +
                "WHERE column1::text OPERATOR (public.<->) '" + baseWord + "'::text < 0.9 " +
                "ORDER BY dist";
    }

    @NotNull
    public static String buildCopyQuery(String sourceTable, String targetTable,
                                        List<SimplePropertyDto> sourcePropsWithoutSystemFields,
                                        List<SimplePropertyDto> targetProps, List<Long> featureIds,
                                        Map<String, Object> systemAutogeneratedFieldForTargetTable) {
        String insertTo = "INSERT INTO " + targetTable;
        String data = mappingColumns(sourcePropsWithoutSystemFields,
                                     targetProps,
                                     systemAutogeneratedFieldForTargetTable);
        String from = " FROM " + sourceTable;
        String where = String.format(" WHERE %s IN (%s)", PRIMARY_KEY, join(featureIds));
        String returnIds = String.format(" RETURNING %s;", PRIMARY_KEY);

        return insertTo + data + from + where + returnIds;
    }

    @NotNull
    public static String buildCopyQuery(String sourceTable,
                                        String targetTable,
                                        List<SimplePropertyDto> sourcePropsWithoutSystemFields,
                                        List<SimplePropertyDto> targetProps,
                                        String filter,
                                        Map<String, Object> systemAutogeneratedFieldForTargetTable) {
        String insertTo = "INSERT INTO " + targetTable;
        String data = mappingColumns(sourcePropsWithoutSystemFields,
                                     targetProps,
                                     systemAutogeneratedFieldForTargetTable);
        String from = " FROM " + sourceTable;
        String where = String.format(" WHERE %s", filter);

        return insertTo + data + from + where;
    }

    @NotNull
    public static String buildCopyShpFileQuery(ResourceQualifier sourceTable,
                                               ResourceQualifier targetTable,
                                               List<SimplePropertyDto> sourceProps,
                                               List<SimplePropertyDto> targetProps,
                                               Map<String, Object> systemAutogeneratedFieldForTargetTable) {

        Optional<String> geometrySourcePropertyName = getPropertyNameByType(ValueType.GEOMETRY, sourceProps);
        Optional<String> geometryTargetPropertyName = getPropertyNameByType(ValueType.GEOMETRY, targetProps);

        geometryTargetPropertyName.ifPresent(s -> updateGeometryPropertyName(sourceProps, s));

        String insertTo = "INSERT INTO " + targetTable.getQualifier();
        String data = mappingColumns(sourceProps, targetProps, systemAutogeneratedFieldForTargetTable);
        String from = " FROM " + sourceTable.getQualifier();

        if (geometryTargetPropertyName.isPresent() && geometrySourcePropertyName.isPresent()) {
            String searchPattern = "\\\"" + geometryTargetPropertyName.get() + "\\\"";
            data = data.replaceFirst(searchPattern, "\"" + geometrySourcePropertyName.get() + "\"");
        }

        return String.format("WITH rows AS (%s %s %s RETURNING 1) SELECT count(*) FROM rows;",
                             insertTo, data, from);
    }

    private static void updateGeometryPropertyName(List<SimplePropertyDto> properties, String newName) {
        properties.stream()
                  .filter(p -> p.getValueTypeAsEnum() == ValueType.GEOMETRY)
                  .forEach(p -> p.setName(newName));
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
        return String.format("DROP TABLE IF EXISTS %s;", table.getTableQualifier());
    }

    @NotNull
    public static String buildCreateTableQuery(String schemaName,
                                               String targetTable,
                                               String idColumnName,
                                               String otherProps) {
        return String.format("CREATE TABLE %1$s (%2$s bigserial NOT NULL %3$s); " +
                                     "ALTER TABLE ONLY %1$s ADD CONSTRAINT %4$s_pkey PRIMARY KEY (%2$s)",
                             schemaName + "." + targetTable, idColumnName, otherProps, targetTable);
    }

    @NotNull
    public static String generatePropertySqlString(@NotNull SimplePropertyDto attrDescription) {
        Object defaultValue = attrDescription.getDefaultValue();

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
                if (defaultValue == null) {
                    result = attrDescription.getName() + " text";
                    break;
                }

                result = attrDescription.getName() + " text default '" + defaultValue + "'";
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
                if (defaultValue == null) {
                    result = attrDescription.getName() + " boolean";
                    break;
                }

                boolean parseBoolean = Boolean.parseBoolean(defaultValue.toString());
                result = attrDescription.getName() + " boolean default " + parseBoolean;
                break;
            case UUID:
                Object defaultValueWellKnownFormula = attrDescription.getDefaultValueWellKnownFormula();
                String generationUUID = " uuid default uuid_in(md5(random()::text || random()::text)::cstring)";
                if (nonNull(defaultValueWellKnownFormula) && defaultValueWellKnownFormula.equals("UUID")) {
                    result = attrDescription.getName() + generationUUID;
                    break;
                }

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

    private static String mappingColumns(List<SimplePropertyDto> sourcePropsWithoutSystemFields,
                                         List<SimplePropertyDto> targetProps,
                                         Map<String, Object> systemAutogeneratedFieldForTargetTable) {
        String pre = " (";
        String post = ") ";

        StringBuilder targetColumns = new StringBuilder();
        StringBuilder sourceColumns = new StringBuilder("SELECT ");

        for (SimplePropertyDto sourceProperty: sourcePropsWithoutSystemFields) {
            String sourceName = sourceProperty.getName().toLowerCase();
            ValueType sourceValueType = sourceProperty.getValueTypeAsEnum();

            List<SimplePropertyDto> filteredProps = targetProps
                    .stream()
                    .filter(equalByName(sourceName))
                    .filter(notGeneratedProperty())
                    .filter(compatibleByType(sourceValueType))
                    .collect(Collectors.toList());

            if (!filteredProps.isEmpty()) {
                targetColumns.append(sourceName).append(", ");
                sourceColumns.append("\"").append(sourceName).append("\", ");
            }
        }

        for (SimplePropertyDto targetProperty: targetProps) {
            String targetPropertyName = targetProperty.getName();
            if (systemAutogeneratedFieldForTargetTable.containsKey(targetPropertyName)) {
                targetColumns.append(targetPropertyName).append(", ");
                sourceColumns.append("'").append(systemAutogeneratedFieldForTargetTable.get(targetPropertyName))
                             .append("', ");
            }
        }

        targetColumns = new StringBuilder(pre + targetColumns.substring(0, targetColumns.length() - 2) + post);
        sourceColumns = new StringBuilder(sourceColumns.substring(0, sourceColumns.length() - 2));

        return targetColumns + sourceColumns.toString();
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

    @NotNull
    private static String buildFtsDocumentsQuery(String ftsTable,
                                                 String ecqlFilter,
                                                 @Nullable List<String> requestedTables,
                                                 @NotNull Set<String> words) {
        String ftsWhere = (requestedTables != null)
                ? buildFtsWhere(ecqlFilter, requestedTables)
                : buildFtsWhere(ecqlFilter);

        String onlyFtsReady = "";
        if ("fts_layers".equals(ftsTable)) {
            onlyFtsReady = "INNER JOIN data.schemas_and_tables st ON (d.\"table\" = st.identifier AND st.ready_for_fts)";
        } else if ("fts_documents".equals(ftsTable)) {
            onlyFtsReady = "INNER JOIN (SELECT table_name, ready_for_fts FROM data.doc_libraries) dl ON (d.\"table\" = dl.table_name AND dl.ready_for_fts)";
        }

        // В данном запросе внутренний SELECT это первое сужение всего набора данных - выборка по найденным словам в
        // словаре, с ранжированием и ограничением с плавающим лимитом.
        // Результат этой выборки передается на обработку нечетким поиском оператором <<<->.
        // Проблема в том что при поиске с большим кол-вом слов или по "неудачным" словам, сужение данных практически
        // не происходит, что ведет за собой очень долгую работу неточного поиска, что недопустимо.
        // Ориентир такой, что по объему в 128к записей неточный поиск выполняется за примерно 5 сек.
        // По идее лимита записей, ранжированных первичной функцией, вполне себе хватает - актуальные объекты ищутся.
        // Но особо уменьшать лимит не имеет смысла, гораздо важнее сокращать список слов.
        int limit = generateLimit(words);

        return "SELECT :searchedText OPERATOR (public.<<<->) subquery.concatenated_data as dist, " +
                "       subquery.schema, " +
                "       subquery.table, " +
                "       subquery.id, " +
                "       subquery.concatenated_data " +
                "FROM (" +
                "       SELECT ts_rank(d.vector_data, query) AS _rank_," +
                "              d.schema," +
                "              d.table," +
                "              d.id," +
                "              d.concatenated_data" +
                "       FROM data." + ftsTable + " AS d " +
                "            CROSS JOIN to_tsquery('" + String.join(" | ", words) + "') query " +
                "   " + onlyFtsReady + " " +
                "   " + ftsWhere + " " +
                "       ORDER BY _rank_ DESC, d.id LIMIT " + limit +
                "     ) AS subquery " +
                "ORDER BY dist ";
    }

    private static String buildFtsWhere(String ecqlFilter) {
        String ftsCondition = "d.vector_data @@ query";

        String filter = buildWhereSection(ecqlFilter);

        String result;
        if (filter.isBlank()) {
            result = "WHERE " + ftsCondition;
        } else {
            result = buildWhereSection(ecqlFilter) + " AND " + ftsCondition;
        }

        return result;
    }

    private static String buildFtsWhere(String ecqlFilter, List<String> resources) {
        String result = buildFtsWhere(ecqlFilter);

        if (!resources.isEmpty()) {
            List<String> asString = resources.stream()
                                             .map(s -> "'" + s + "'")
                                             .collect(Collectors.toList());

            result = result + " AND \"table\" IN (" + String.join(",", asString) + ")";
        }

        return result;
    }

    private static int generateLimit(Set<String> words) {
        int BASE_LIMIT = 512_000;

        if (words == null || words.isEmpty()) {
            return BASE_LIMIT;
        } else if (words.size() < 3) {
            return BASE_LIMIT / 2;
        } else if (words.size() < 6) {
            return BASE_LIMIT / 4;
        } else if (words.size() < 8) {
            return BASE_LIMIT / 8;
        } else if (words.size() <= 10) {
            return BASE_LIMIT / 16;
        } else {
            return BASE_LIMIT / 32;
        }
    }
}
