package ru.mycrg.data_service.dao;

import com.healthmarketscience.sqlbuilder.CustomCondition;
import com.healthmarketscience.sqlbuilder.InsertQuery;
import com.healthmarketscience.sqlbuilder.UpdateQuery;
import com.healthmarketscience.sqlbuilder.dbspec.basic.DbColumn;
import com.healthmarketscience.sqlbuilder.dbspec.basic.DbSchema;
import com.healthmarketscience.sqlbuilder.dbspec.basic.DbSpec;
import com.healthmarketscience.sqlbuilder.dbspec.basic.DbTable;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dao.mappers.RecordRowMapper;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.*;

import static ru.mycrg.data_service.dao.utils.SqlBuilder.*;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.ID;

@Service
@Transactional
public class RecordsDao {

    private final Logger log = LoggerFactory.getLogger(RecordsDao.class);

    private final NamedParameterJdbcTemplate pJdbcTemplate;
    private final BaseDao baseDao;

    public RecordsDao(NamedParameterJdbcTemplate parameterJdbcTemplate, BaseDao baseDao) {
        System.setProperty("com.healthmarketscience.sqlbuilder.useBooleanLiterals", "true");
        this.pJdbcTemplate = parameterJdbcTemplate;
        this.baseDao = baseDao;
    }

    public IRecord addRecord(@NotNull ResourceQualifier rIdentifier,
                             @NotNull IRecord record) throws CrgDaoException {
        try {
            DbTable table = getSimpleDbTable(rIdentifier);
            InsertQuery insertQuery = new InsertQuery(table);

            record.getContent().forEach((key, value) -> {
                DbColumn dbColumn = table.addColumn(key);

                insertQuery.addColumn(dbColumn, value);
            });
            String query = insertQuery.validate().toString();
            query = query + " returning lastval();";

            log.debug("INSERT QUERY: [{}]", query);

            Long id = pJdbcTemplate.getJdbcTemplate().queryForObject(query, Long.class);

            record.getContent().put(ID.getName(), id);

            return record;
        } catch (DataAccessException e) {
            String msg = String.format("Не удалось выполнить вставку в таблицу: '%s'. %s",
                                       rIdentifier, e.getCause().getMessage());

            throw new CrgDaoException(msg);
        } catch (Exception e) {
            String msg = String.format("Что то пошло не так при вставке в таблицу: '%s'. %s",
                                       rIdentifier, e.getCause().getMessage());

            throw new CrgDaoException(msg);
        }
    }

    public void addRecordsAsBatch(@NotNull ResourceQualifier rIdentifier,
                                  @NotNull Map<String, Object>[] body) throws CrgDaoException {
        try {
            Set<String> columnNames = body[0].keySet();
            StringBuilder queryColumns = new StringBuilder();
            StringBuilder queryValues = new StringBuilder();
            String complexName = rIdentifier.getSchema() + "." + rIdentifier.getTable();
            for (int i = 0; i < columnNames.size(); i++) {
                if (i == columnNames.size() - 1) {
                    queryColumns.append(columnNames.toArray()[i]);
                    queryValues.append(" :").append(columnNames.toArray()[i]);
                } else {
                    queryColumns.append(columnNames.toArray()[i]).append(", ");
                    queryValues.append(" :").append(columnNames.toArray()[i]).append(",");
                }
            }

            String query = "insert into " + complexName + "(" + queryColumns.toString().toLowerCase() + ")" +
                    " values (" + queryValues.toString().toLowerCase() + ")";

            log.debug("BATCH INSERT QUERY: [{}]", query);

            pJdbcTemplate.batchUpdate(query, body);
        } catch (DataAccessException e) {
            String msg = String.format("Не удалось выполнить вставку в таблицу: '%s'. %s",
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
            String query = String.format("SELECT * FROM %s WHERE id = :id", recordQualifier.getResourceTable());

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

        String query = "SELECT * FROM " + tableQualifier +
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

    public void updateRecordById(ResourceQualifier recordQualifier, Map<String, Object> data) throws CrgDaoException {
        try {
            DbTable table = getSimpleDbTable(recordQualifier);
            UpdateQuery updateQuery = new UpdateQuery(table);
            updateQuery.addCondition(
                    new CustomCondition(String.format("%s = %d", ID.getName(), recordQualifier.getRecord())));

            data.forEach((key, value) -> {
                updateQuery.addSetClause(table.addColumn(key), value);
            });
            String query = updateQuery.validate().toString();

            log.debug("UPDATE QUERY: [{}]", query);

            pJdbcTemplate.getJdbcTemplate().update(query);
        } catch (DataAccessException e) {
            String msg = String.format("Не удалось выполнить обновление записи: '%s'. %s",
                                       recordQualifier.getQualifier(), e.getCause().getMessage());

            throw new CrgDaoException(msg);
        } catch (Exception e) {
            String msg = String.format("Что то пошло не так при обновлении записи: '%s'. %s",
                                       recordQualifier.getQualifier(), e.getCause().getMessage());

            throw new CrgDaoException(msg);
        }
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

    private DbTable getSimpleDbTable(@NotNull ResourceQualifier rQualifier) {
        DbSpec spec = new DbSpec();
        DbSchema dbSchema = spec.addSchema(rQualifier.getSchema());

        return dbSchema.addTable(rQualifier.getTable());
    }
}
