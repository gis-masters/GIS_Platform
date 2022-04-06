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
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;

import java.util.List;
import java.util.Optional;

import static ru.mycrg.data_service.dao.config.DaoProperties.PRIMARY_KEY;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.generateInsertQuery;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.generateUpdateQuery;
import static ru.mycrg.data_service.util.DetailedLogger.logError;

@Repository
@Transactional
public class SpatialRecordsDao {

    private final Logger log = LoggerFactory.getLogger(SpatialRecordsDao.class);

    private final NamedParameterJdbcTemplate pJdbcTemplate;

    public SpatialRecordsDao(NamedParameterJdbcTemplate parameterJdbcTemplate) {
        System.setProperty("com.healthmarketscience.sqlbuilder.useBooleanLiterals", "true");
        this.pJdbcTemplate = parameterJdbcTemplate;
    }

    public Feature save(@NotNull ResourceQualifier rIdentifier,
                        @NotNull Feature feature) throws CrgDaoException {
        try {
            String query = generateInsertQuery(rIdentifier, feature);

            log.debug("INSERT QUERY: [{}]", query);

            Long id = pJdbcTemplate.getJdbcTemplate().queryForObject(query, Long.class);

            feature.setId(id);

            return feature;
        } catch (DataAccessException e) {
            String msg = String.format("Не удалось выполнить вставку в таблицу: '%s'", rIdentifier);
            logError(msg, e);

            throw new CrgDaoException(msg);
        } catch (Exception e) {
            String msg = String.format("Что то пошло не так при вставке в таблицу: '%s'", rIdentifier);
            logError(msg, e);

            throw new CrgDaoException(msg);
        }
    }

    public Optional<Feature> findById(ResourceQualifier qualifier, SchemaDto schema) {
        try {
            String query = String.format("SELECT * FROM %s WHERE %s = %d",
                                         qualifier.getTableQualifier(), PRIMARY_KEY, qualifier.getRecord());

            log.debug("find feature by id: [{}]", query);

            List<Feature> features = pJdbcTemplate.query(query,
                                                         new MapSqlParameterSource("id", qualifier.getRecord()),
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

    public void updateById(ResourceQualifier qualifier, Feature newFeature) throws CrgDaoException {
        try {
            String query = generateUpdateQuery(qualifier, newFeature);

            log.debug("UPDATE QUERY: [{}]", query);

            pJdbcTemplate.getJdbcTemplate().update(query);
        } catch (DataAccessException e) {
            String msg = String.format("Не удалось выполнить обновление фичи: '%s'. %s",
                                       qualifier.getQualifier(), e.getCause().getMessage());

            throw new CrgDaoException(msg);
        } catch (Exception e) {
            String msg = String.format("Что то пошло не так при обновлении фичи: '%s'. %s",
                                       qualifier.getQualifier(), e.getCause().getMessage());

            throw new CrgDaoException(msg);
        }
    }

    public boolean isExist(ResourceQualifier qualifier) {
        try {
            String query = String.format("SELECT * FROM %s WHERE %s = :id", qualifier.getTableQualifier(), PRIMARY_KEY);

            log.debug("Query is feature exist by id: [{}]", query);

            Boolean result = pJdbcTemplate.queryForObject(query,
                                                          new MapSqlParameterSource("id", qualifier.getRecord()),
                                                          Boolean.class);

            return Boolean.TRUE.equals(result);
        } catch (DataAccessException e) {
            log.warn("Check table: {} failed: {}", qualifier, e.getMessage());

            return true;
        }
    }

    public void removeRecord(ResourceQualifier rQualifier, Long id) throws CrgDaoException {
        try {
            String query = String.format("DELETE FROM %s WHERE %s = %d",
                                         rQualifier.getTableQualifier(), PRIMARY_KEY, id);

            log.debug("Request to delete feature: [{}]", query);

            pJdbcTemplate.update(query, new MapSqlParameterSource("id", id));
        } catch (Exception e) {
            String msg = String.format("Не удалось выполнить удаление фичи: '%s' из: '%s'",
                                       id, rQualifier.getTableQualifier());

            throw new CrgDaoException(msg, e.getCause());
        }
    }
}
