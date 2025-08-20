package ru.mycrg.data_service.dao;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dao.mappers.FeatureRowMapper;
import ru.mycrg.common_contracts.generated.data_service.GeometryValidationResultDto;
import ru.mycrg.data_service.dao.utils.SqlParameterSourceFactory;
import ru.mycrg.data_service.mappers.FeatureMapper;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.geo_json.Feature;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static java.lang.String.format;
import static java.lang.String.join;
import static java.util.stream.Collectors.toList;
import static ru.mycrg.data_service.dao.utils.ResourceQualifierUtil.getIdField;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.*;
import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.StringUtil.join;

@Repository
@Transactional
public class SpatialRecordsDao {

    private final Logger log = LoggerFactory.getLogger(SpatialRecordsDao.class);

    private final BaseReadDao baseDao;
    private final BaseWriteDao pBaseDao;
    private final NamedParameterJdbcTemplate pJdbcTemplate;
    private final SqlParameterSourceFactory sqlParameterSourceFactory;

    public SpatialRecordsDao(BaseReadDao baseDao,
                             NamedParameterJdbcTemplate parameterJdbcTemplate,
                             BaseWriteDao pBaseDao,
                             SqlParameterSourceFactory parameterSourceMapperFactory) {
        this.baseDao = baseDao;
        this.pJdbcTemplate = parameterJdbcTemplate;
        this.pBaseDao = pBaseDao;
        this.sqlParameterSourceFactory = parameterSourceMapperFactory;
    }

    public List<Feature> findAll(ResourceQualifier tableQualifier,
                                 String ecqlFilter,
                                 SchemaDto schema,
                                 Pageable pageable) {
        return baseDao.findAll(tableQualifier, ecqlFilter, pageable, new FeatureRowMapper(schema));
    }

    public Long total(ResourceQualifier tableQualifier, String ecqlFilter) {
        return baseDao.total(tableQualifier, ecqlFilter);
    }

    public Optional<Feature> findById(ResourceQualifier qualifier, SchemaDto schema) {
        try {
            String fieldId = getIdField(qualifier);
            String query = format("SELECT * FROM %s WHERE %s = %d",
                                  qualifier.getTableQualifier(), fieldId, qualifier.getRecordIdAsLong());

            log.debug("find feature by id: [{}]", query);

            List<Feature> features = pJdbcTemplate.query(query,
                                                         new MapSqlParameterSource(fieldId,
                                                                                   qualifier.getRecordIdAsLong()),
                                                         new RowMapperResultSetExtractor<>(
                                                                 new FeatureRowMapper(schema)
                                                         ));
            if (features == null || features.isEmpty()) {
                return Optional.empty();
            }

            return Optional.ofNullable(features.get(0));
        } catch (DataAccessException e) {
            return Optional.empty();
        }
    }

    public List<Feature> findByIds(ResourceQualifier qualifier, SchemaDto schema, List<Long> ids) {
        try {
            String fieldId = getIdField(qualifier);
            String query = format("SELECT * FROM %s WHERE %s IN (%s)",
                                  qualifier.getTableQualifier(), fieldId, join(ids));

            log.debug("find feature by id's: [{}]", query);

            return pJdbcTemplate.query(query,
                                       new MapSqlParameterSource(fieldId, join(ids)),
                                       new RowMapperResultSetExtractor<>(
                                               new FeatureRowMapper(schema)
                                       ));
        } catch (DataAccessException e) {
            return new ArrayList<>();
        }
    }

    public Feature save(@NotNull ResourceQualifier qualifier,
                        @NotNull Feature feature,
                        @NotNull SchemaDto schema) throws CrgDaoException {
        String query = buildParameterizedInsertQuery(qualifier, feature, false);
        MapSqlParameterSource parameterSource = sqlParameterSourceFactory.buildParameterizedSource(feature, schema);

        KeyHolder keyHolder = pBaseDao.save(query, parameterSource);

        return FeatureMapper.mapToFeature(feature, keyHolder.getKeys());
    }

    public void updateByIds(ResourceQualifier qualifier,
                            Feature feature,
                            SchemaDto schema,
                            List<Long> ids) throws CrgDaoException {
        try {
            String query = buildParameterizedUpdateQuery(qualifier, feature, qualifier.getPrimaryKeyName(), ids);
            MapSqlParameterSource parameterSource = sqlParameterSourceFactory.buildParameterizedSource(
                    feature,
                    schema);

            pBaseDao.update(query, parameterSource);
        } catch (CrgDaoException e) {
            String msg = format("Не удалось обновить записи: '%s' в таблице %s",
                                join(ids), qualifier.getTableQualifier());
            logError(msg, e);

            throw new CrgDaoException(msg);
        } catch (Exception e) {
            String msg = format("Что то пошло не так при обновлении записей: '%s' в таблице: '%s'",
                                join(ids), qualifier.getTableQualifier());
            logError(msg, e);

            throw new CrgDaoException(msg);
        }
    }

    public void batchUpdate(ResourceQualifier qualifier,
                            List<Feature> features,
                            SchemaDto schema) throws CrgDaoException {
        try {
            String fieldId = getIdField(qualifier);
            String batchQuery = buildParameterizedBatchUpdateQuery(qualifier, features.get(0), fieldId);

            List<MapSqlParameterSource> sqlParameterSources = features
                    .stream()
                    .map(feature -> {
                        return sqlParameterSourceFactory.buildParameterizedSource(feature, schema);
                    })
                    .collect(toList());

            pBaseDao.batchUpdate(batchQuery, sqlParameterSources);
        } catch (CrgDaoException e) {
            String msg = format("Не удалось выполнить batchUpdate для таблицы: '%s'", qualifier.getTableQualifier());
            logError(msg, e);

            throw new CrgDaoException(msg);
        } catch (Exception e) {
            String msg = format("Что то пошло не так при обновлении записи: '%s' в таблице: '%s'",
                                qualifier.getRecordIdAsLong(), qualifier.getTableQualifier());
            logError(msg, e);

            throw new CrgDaoException(msg);
        }
    }

    public boolean isExist(ResourceQualifier qualifier) {
        try {
            String fieldId = getIdField(qualifier);
            String query = format("SELECT * FROM %s WHERE %s = :id", qualifier.getTableQualifier(), fieldId);

            log.debug("Query is feature exist by id: [{}]", query);

            Boolean result = pJdbcTemplate.queryForObject(query,
                                                          new MapSqlParameterSource(fieldId,
                                                                                    qualifier.getRecordIdAsLong()),
                                                          Boolean.class);

            return Boolean.TRUE.equals(result);
        } catch (DataAccessException e) {
            log.warn("Check table: {} failed: {}", qualifier, e.getMessage());

            return true;
        }
    }

    public void removeMultipleRecords(ResourceQualifier qualifier, List<Long> ids) throws CrgDaoException {
        try {
            String fieldId = getIdField(qualifier);
            Iterable<String> iterable = ids.stream().map(Object::toString).collect(toList());

            String query = format("DELETE FROM %s WHERE %s IN (%s)",
                                  qualifier.getTableQualifier(), fieldId, join(",", iterable));
            log.debug("Request to delete several features: [{}]", query);

            pJdbcTemplate.update(query, new MapSqlParameterSource(fieldId, ids));
        } catch (Exception e) {
            String msg = format("Не удалось выполнить удаление фичей: '%s' из: '%s'",
                                ids, qualifier.getTableQualifier());
            logError(msg, e);

            throw new CrgDaoException(msg, e.getCause());
        }
    }

    public List<Long> copyRecords(String sourceTable, List<SimplePropertyDto> sourcePropsWithoutSystemFields,
                                  String targetTable, List<SimplePropertyDto> targetProps,
                                  List<Long> featureIds,
                                  Map<String, Object> systemAutogeneratedFieldForTargetTable) {
        String copyQuery = buildCopyQuery(sourceTable,
                                          targetTable,
                                          sourcePropsWithoutSystemFields,
                                          targetProps,
                                          featureIds,
                                          systemAutogeneratedFieldForTargetTable);

        log.debug("SQL copy records query: [{}]", copyQuery);

        return pJdbcTemplate.getJdbcTemplate()
                            .queryForList(copyQuery, Long.class);
    }

    public GeometryValidationResultDto validateGeometry(String geometryJson) {
        String geometryValidMessage = "Valid Geometry";
        String query =
                "SELECT public.st_isvalidreason(geom) as reason " +
                        "FROM ( " +
                        "    SELECT public.st_geomfromgeojson(:geometry::jsonb) as geom " +
                        ") t";

        return pJdbcTemplate.queryForObject(
                query,
                new MapSqlParameterSource("geometry", geometryJson),
                (validationRow, rowNum) -> {
                    String reason = validationRow.getString("reason");

                    return new GeometryValidationResultDto(geometryValidMessage.equals(reason), reason);
                }
        );
    }

    //Если мы не можем корректно трансформировать координаты в общемировые, то мы считаем что они за пределами мира
    public GeometryValidationResultDto checkOnEarthSurface(String geometryJson, String layerEpsg) {
        String defaultEpsgConvert = "4326";
        String geometryValidMessage = "Valid Geometry";

        String query =
                "WITH transformed AS ( " +
                        "  SELECT public.st_transform( " +
                        "           public.st_setsrid( " +
                        "             public.st_geomfromgeojson(CAST(:geometry AS json)), " +
                        "             :fromSRID " +
                        "           ), " +
                        "           :toSRID " +
                        "         ) AS geom " +
                        ") " +
                        "SELECT public.st_isvalidreason(geom) AS reason FROM transformed";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("geometry", geometryJson)
                .addValue("fromSRID", Integer.parseInt(layerEpsg))
                .addValue("toSRID", Integer.parseInt(defaultEpsgConvert));

        return pJdbcTemplate.queryForObject(
                query,
                params,
                (validationRow, rowNum) -> {
                    String reason = validationRow.getString("reason");
                    return new GeometryValidationResultDto(geometryValidMessage.equals(reason), reason);
                }
        );
    }

    public String makeValidGeometry(String geometryJson) {
        String query =
                "SELECT public.st_asgeojson(" +
                        "    public.st_makevalid(" +
                        "        public.st_geomfromgeojson(:geometry::jsonb)" +
                        "    )" +
                        ")::jsonb AS geometry";

        return pJdbcTemplate.queryForObject(
                query,
                new MapSqlParameterSource("geometry", geometryJson),
                String.class
        );
    }

    /**
     * Преобразует геометрию в формате GeoJSON к заданному типу.
     * <p>
     * В зависимости от флага {@code isSimpleGeometry}:
     * <ul>
     *     <li>true — извлекается первый объект нужного типа из коллекции;</li>
     *     <li>false — формируется мульти-геометрия из всех подходящих объектов.</li>
     * </ul>
     * Может вернуть пустую геометрию, например когда дали полигон и просят вернуть точку.
     * Может вернуть пустоту.
     *
     * @param geometryJson     входная геометрия в формате GeoJSON
     * @param geometryType     тип геометрии (например, 1 — Multi/Point, 2 — Multi/LineString, 3 — Multi/Polygon)
     * @param isSimpleGeometry нужно ли возвращать простую геометрию (true) или мульти-объект (false)
     */
    public String makeGeometryOptionType(String geometryJson, Integer geometryType, Boolean isSimpleGeometry)
            throws CrgDaoException {
        String query;
        if (isSimpleGeometry) {
            query = "SELECT public.ST_AsGeoJSON(" +
                    "    public.ST_GeometryN(" +
                    "        public.ST_CollectionExtract(" +
                    "            public.ST_GeomFromGeoJSON(:geometry), :geometryType" +
                    "        ), 1" +
                    "    )" +
                    ") AS geometry";
        } else {
            query = "SELECT public.ST_AsGeoJSON(" +
                    "    public.ST_Multi(" +
                    "        public.ST_Union(" +
                    "            public.ST_CollectionExtract(" +
                    "                public.ST_GeomFromGeoJSON(:geometry), :geometryType" +
                    "            )" +
                    "        )" +
                    "    )" +
                    ") AS geometry";
        }

        try {
            return pJdbcTemplate.queryForObject(
                    query,
                    new MapSqlParameterSource()
                            .addValue("geometry", geometryJson)
                            .addValue("geometryType", geometryType),
                    String.class);
        } catch (Exception e) {
            String msg = "Не удалось выполнить запрос преобразования геометрии";
            logError(msg, e);

            throw new CrgDaoException(msg, e.getCause());
        }
    }
}
