package ru.mycrg.data_service.dao;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dao.mappers.FeatureRowMapper;
import ru.mycrg.data_service.dao.utils.SqlParameterSourceFactory;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static java.lang.String.format;
import static java.lang.String.join;
import static java.util.stream.Collectors.toList;
import static ru.mycrg.data_service.dao.config.DaoProperties.PRIMARY_KEY;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.*;
import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.StringUtil.join;

@Repository
@Transactional
public class SpatialRecordsDao {

    private final Logger log = LoggerFactory.getLogger(SpatialRecordsDao.class);

    private final ParameterizedBaseDao pBaseDao;
    private final NamedParameterJdbcTemplate pJdbcTemplate;
    private final SqlParameterSourceFactory sqlParameterSourceFactory;

    public SpatialRecordsDao(NamedParameterJdbcTemplate parameterJdbcTemplate,
                             ParameterizedBaseDao pBaseDao,
                             SqlParameterSourceFactory parameterSourceMapperFactory) {
        this.pJdbcTemplate = parameterJdbcTemplate;
        this.pBaseDao = pBaseDao;
        this.sqlParameterSourceFactory = parameterSourceMapperFactory;
    }

    public Optional<Feature> findById(ResourceQualifier qualifier, SchemaDto schema) {
        try {
            String query = format("SELECT * FROM %s WHERE %s = %d",
                                  qualifier.getTableQualifier(), PRIMARY_KEY, qualifier.getRecordIdAsLong());

            log.debug("find feature by id: [{}]", query);

            List<Feature> features = pJdbcTemplate.query(query,
                                                         new MapSqlParameterSource("id", qualifier.getRecordIdAsLong()),
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
            String query = format("SELECT * FROM %s WHERE %s in (%s)",
                                  qualifier.getTableQualifier(), PRIMARY_KEY, join(ids));

            log.debug("find feature by id: [{}]", query);

            return pJdbcTemplate.query(query,
                                       new MapSqlParameterSource("id", join(ids)),
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
        String query = buildParameterizedInsertQuery(qualifier, feature, true);
        MapSqlParameterSource parameterSource = sqlParameterSourceFactory.buildParameterizedSource(feature, schema);

        Long id = pBaseDao.save(query, parameterSource);

        feature.setId(id);

        return feature;
    }

    public void updateByIds(ResourceQualifier qualifier,
                            Feature feature,
                            String primaryKey,
                            SchemaDto schema,
                            List<Long> ids) throws CrgDaoException {
        try {
            String query = buildParameterizedUpdateQuery(qualifier, feature, primaryKey, ids);
            MapSqlParameterSource parameterSource = sqlParameterSourceFactory.buildParameterizedSource(
                    feature,
                    schema);

            pBaseDao.updateById(query, parameterSource);
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
            String batchQuery = buildParameterizedBatchUpdateQuery(qualifier, features.get(0), PRIMARY_KEY);

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
            String query = format("SELECT * FROM %s WHERE %s = :id", qualifier.getTableQualifier(), PRIMARY_KEY);

            log.debug("Query is feature exist by id: [{}]", query);

            Boolean result = pJdbcTemplate.queryForObject(query,
                                                          new MapSqlParameterSource("id",
                                                                                    qualifier.getRecordIdAsLong()),
                                                          Boolean.class);

            return Boolean.TRUE.equals(result);
        } catch (DataAccessException e) {
            log.warn("Check table: {} failed: {}", qualifier, e.getMessage());

            return true;
        }
    }

    public void removeMultipleRecords(ResourceQualifier rQualifier, List<Long> ids) throws CrgDaoException {
        try {
            Iterable<String> iterable = ids.stream().map(Object::toString).collect(toList());

            String query = format("DELETE FROM %s WHERE %s in (%s)",
                                  rQualifier.getTableQualifier(), PRIMARY_KEY, join(",", iterable));
            log.debug("Request to delete several features: [{}]", query);

            pJdbcTemplate.update(query, new MapSqlParameterSource("id", ids));
        } catch (Exception e) {
            String msg = format("Не удалось выполнить удаление фичей: '%s' из: '%s'",
                                ids, rQualifier.getTableQualifier());
            logError(msg, e);

            throw new CrgDaoException(msg, e.getCause());
        }
    }

    public List<Long> copyRecords(String sourceTable, SchemaDto sourceSchema,
                                  String targetTable, SchemaDto targetSchema,
                                  List<Long> featureIds) {
        String copyQuery = buildCopyQuery(sourceTable, targetTable, sourceSchema, targetSchema, featureIds);

        log.debug("SQL copy records query: [{}]", copyQuery);

        return pJdbcTemplate.getJdbcTemplate()
                            .queryForList(copyQuery, Long.class);
    }
}
