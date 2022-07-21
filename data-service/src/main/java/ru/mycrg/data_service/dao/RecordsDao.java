package ru.mycrg.data_service.dao;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dao.mappers.RecordRowMapper;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;

import java.util.*;

import static ru.mycrg.data_service.dao.utils.EcqlHandler.buildWhereSection;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildInSection;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildOrderBySection;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.ID;

@Repository
@Transactional
public class RecordsDao {

    private final Logger log = LoggerFactory.getLogger(RecordsDao.class);

    private final BaseDao baseDao;
    private final SpatialRecordsDao spatialRecordsDao;
    private final NamedParameterJdbcTemplate pJdbcTemplate;

    public RecordsDao(NamedParameterJdbcTemplate parameterJdbcTemplate,
                      SpatialRecordsDao spatialRecordsDao,
                      BaseDao baseDao) {
        System.setProperty("com.healthmarketscience.sqlbuilder.useBooleanLiterals", "true");
        this.baseDao = baseDao;
        this.spatialRecordsDao = spatialRecordsDao;
        this.pJdbcTemplate = parameterJdbcTemplate;
    }

    public IRecord addRecord(@NotNull ResourceQualifier qualifier,
                             @NotNull IRecord record,
                             @NotNull SchemaDto schema) throws CrgDaoException {
        Feature savedFeature = spatialRecordsDao.save(qualifier,
                                                      new Feature(record.getContent()),
                                                      schema);
        record.getContent().put(ID.getName(), savedFeature.getId());

        return record;
    }

    public void updateRecordById(@NotNull ResourceQualifier qualifier,
                                 @NotNull Map<String, Object> data,
                                 @NotNull SchemaDto schema) throws CrgDaoException {
        spatialRecordsDao.updateById(qualifier, new Feature(data), ID.getName(), schema);
    }

    public void addRecordsAsBatch(@NotNull ResourceQualifier rIdentifier,
                                  @NotNull Map<String, Object>[] body) throws CrgDaoException {
        try {
            Set<String> columnNames = body[0].keySet();
            StringBuilder queryColumns = new StringBuilder();
            StringBuilder queryValues = new StringBuilder();
            for (int i = 0; i < columnNames.size(); i++) {
                if (i == columnNames.size() - 1) {
                    queryColumns.append(columnNames.toArray()[i]);
                    queryValues.append(" :").append(columnNames.toArray()[i]);
                } else {
                    queryColumns.append(columnNames.toArray()[i]).append(", ");
                    queryValues.append(" :").append(columnNames.toArray()[i]).append(",");
                }
            }

            String query = "insert into " + rIdentifier.getTableQualifier() +
                    "(" + queryColumns.toString().toLowerCase() + ")" +
                    " values (" + queryValues.toString().toLowerCase() + ")";

            log.debug("BATCH INSERT QUERY: [{}]", query);

            pJdbcTemplate.batchUpdate(query, body);
        } catch (DataAccessException e) {
            String msg = String.format("Не удалось выполнить вставку(batch) в таблицу: '%s'. %s",
                                       rIdentifier, e.getCause().getMessage());

            throw new CrgDaoException(msg);
        } catch (Exception e) {
            String msg = String.format("Что то пошло не так при вставке в таблицу: '%s'. %s",
                                       rIdentifier, e.getCause().getMessage());

            throw new CrgDaoException(msg);
        }
    }

    public Optional<IRecord> findById(ResourceQualifier recordQualifier,
                                      SchemaDto schema) {
        try {
            String query = String.format("SELECT * FROM %s WHERE id = :id", recordQualifier.getTableQualifier());

            log.debug("find record by id: [{}]", query);

            List<IRecord> records = pJdbcTemplate.query(query,
                                                        new MapSqlParameterSource("id", recordQualifier.getRecord()),
                                                        new RowMapperResultSetExtractor<>(
                                                                new RecordRowMapper(schema)
                                                        ));
            if (records == null || records.isEmpty()) {
                return Optional.empty();
            }

            return Optional.ofNullable(records.get(0));
        } catch (DataAccessException e) {
            return Optional.empty();
        }
    }

    public List<IRecord> customListQuery(String sqlRequest,
                                         SchemaDto schema) {
        log.debug("Custom query: [{}]", sqlRequest);

        return pJdbcTemplate.getJdbcTemplate()
                            .query(sqlRequest,
                                   new RowMapperResultSetExtractor<>(
                                           new RecordRowMapper(schema)
                                   ));
    }

    public List<IRecord> findAll(ResourceQualifier tableQualifier,
                                 String ecqlFilter,
                                 SchemaDto schema) {
        MapSqlParameterSource params = new MapSqlParameterSource();

        String query = "SELECT * FROM " + tableQualifier + "  " + buildWhereSection(ecqlFilter);

        log.debug("Request find all by filter: [{}]", query);

        List<IRecord> recordDtos = new ArrayList<>();
        try {
            recordDtos = pJdbcTemplate.query(query,
                                             params,
                                             new RowMapperResultSetExtractor<>(
                                                     new RecordRowMapper(schema)
                                             ));
        } catch (BadSqlGrammarException e) {
            log.warn("Не удалось получить данные из {}, ошибка: {}", tableQualifier, e.getMessage());
        }

        return recordDtos;
    }

    public List<IRecord> findAll(ResourceQualifier tableQualifier,
                                 String ecqlFilter,
                                 SchemaDto schema,
                                 Pageable pageable) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("offset", pageable.getOffset())
                .addValue("limit", pageable.getPageSize());

        String query = "SELECT * FROM " + tableQualifier.getTableQualifier() +
                "  " + buildWhereSection(ecqlFilter) +
                "  " + buildOrderBySection(pageable.getSort()) +
                "  LIMIT :limit OFFSET :offset";

        log.debug("Request find all with filter and pageable: [{}]", query);

        return pJdbcTemplate.query(query,
                                   params,
                                   new RowMapperResultSetExtractor<>(
                                           new RecordRowMapper(schema)
                                   ));
    }

    public List<IRecord> findAllowed(ResourceQualifier tableQualifier,
                                     Set<String> ids,
                                     Set<String> paths,
                                     String ecqlFilter,
                                     SchemaDto schema,
                                     Pageable pageable) {
        String ecqlFiltersSection = buildWhereSection(ecqlFilter);
        if (!ecqlFiltersSection.isBlank()) {
            ecqlFiltersSection = "AND " + ecqlFiltersSection.replace("WHERE", "");
        }

        String query = "" +
                " SELECT " +
                "   * " +
                " FROM " +
                " " + tableQualifier.getTableQualifier() +
                " WHERE " +
                "   (" +
                "     (" +
                "       id IN (" + buildInSection(ids) + ") " +
                "       OR path LIKE ANY (array[ " + buildInSection(paths) + " ])" +
                "     )" +
                " " + ecqlFiltersSection +
                "   )" +
                "  " + buildOrderBySection(pageable.getSort()) +
                " LIMIT " + pageable.getPageSize() + " OFFSET " + pageable.getOffset();

        log.debug("Request find allowed records: [{}]", query);

        return pJdbcTemplate.query(query,
                                   new RowMapperResultSetExtractor<>(
                                           new RecordRowMapper(schema)
                                   ));
    }

    public Long getTotalAllowed(ResourceQualifier tableQualifier,
                                Set<String> ids,
                                Set<String> paths,
                                String ecqlFilter) {
        String ecqlFiltersSection = buildWhereSection(ecqlFilter);
        if (!ecqlFiltersSection.isBlank()) {
            ecqlFiltersSection = "AND " + ecqlFiltersSection.replace("WHERE", "");
        }

        String query = "" +
                " SELECT " +
                "   count(*) " +
                " FROM " +
                " " + tableQualifier.getTableQualifier() +
                " WHERE " +
                "   (" +
                "     (" +
                "       id IN (" + buildInSection(ids) + ") " +
                "       OR path LIKE ANY (array[ " + buildInSection(paths) + " ])" +
                "     )" +
                " " + ecqlFiltersSection +
                "   )";

        log.debug("Request find total allowed records: [{}]", query);

        return pJdbcTemplate.getJdbcTemplate().queryForObject(query, Long.class);
    }

    public Long getTotal(ResourceQualifier tableQualifier, String ecqlFilter) {
        return baseDao.getTotal(tableQualifier, ecqlFilter);
    }

    public void removeRecord(ResourceQualifier rQualifier, Long id) throws CrgDaoException {
        try {
            String query = String.format("DELETE FROM %s WHERE id = :id", rQualifier.getTableQualifier());

            log.debug("Request to delete record: [{}]", query);

            pJdbcTemplate.update(query, new MapSqlParameterSource("id", id));
        } catch (Exception e) {
            String msg = String.format("Не удалось выполнить удаление объекта: '%s' из: '%s'",
                                       id, rQualifier.getTableQualifier());

            throw new CrgDaoException(msg, e.getCause());
        }
    }
}
