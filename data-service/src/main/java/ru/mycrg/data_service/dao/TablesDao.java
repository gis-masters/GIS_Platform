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
import ru.mycrg.data_service.dto.Record;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.*;

import static ru.mycrg.data_service.dao.SqlBuilder.buildOrderBySection;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.ID;

@Service
@Transactional
public class TablesDao {

    private final Logger log = LoggerFactory.getLogger(TablesDao.class);

    private final NamedParameterJdbcTemplate pJdbcTemplate;

    public TablesDao(NamedParameterJdbcTemplate parameterJdbcTemplate) {
        this.pJdbcTemplate = parameterJdbcTemplate;
    }

    public Long addRecord(@NotNull ResourceQualifier rIdentifier,
                          @NotNull Map<String, Object> body) throws CrgDaoException {
        try {
            final DbTable table = getSimpleDbTable(rIdentifier);
            final InsertQuery insertQuery = new InsertQuery(table);

            body.forEach((key, value) -> {
                final DbColumn dbColumn = table.addColumn(key);

                insertQuery.addColumn(dbColumn, value);
            });
            String query = insertQuery.validate().toString();
            query = query + " returning lastval();";

            log.debug("INSERT QUERY: [{}]", query);

            return pJdbcTemplate.getJdbcTemplate().queryForObject(query, Long.class);
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

            String query =
                    "insert into " + complexName + "(" + queryColumns.toString().toLowerCase() + ")" +
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

    public Optional<Map<String, Object>> findById(ResourceQualifier tableQualifier, Long id) {
        try {
            final var object = pJdbcTemplate.queryForObject(
                    String.format("SELECT * FROM %s WHERE id = :id", tableQualifier),
                    new MapSqlParameterSource("id", id),
                    (rs, rowNum) -> getRecordAsObjectMap(rs));

            return Optional.ofNullable(object);
        } catch (DataAccessException e) {
            return Optional.empty();
        }
    }

    public List<Record> customListQuery(String sqlRequest) {
        log.debug("Custom query: [{}]", sqlRequest);

        return pJdbcTemplate.getJdbcTemplate()
                            .query(sqlRequest,
                                   new RowMapperResultSetExtractor<>(
                                           new RecordRowMapper()
                                   ));
    }

    public List<Record> findAllByPath(ResourceQualifier tableQualifier,
                                      String path,
                                      String title,
                                      Pageable pageable) {
        final MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("path", path)
                .addValue("offset", pageable.getOffset())
                .addValue("limit", pageable.getPageSize());

        String sqlTemplate = "SELECT * FROM " + tableQualifier +
                "  WHERE path = :path" +
                "    AND LOWER(title) LIKE LOWER('%" + title + "%')" +
                "  " + buildOrderBySection(pageable.getSort()) +
                "  LIMIT :limit OFFSET :offset";

        log.debug("Request find all by path: [{}]", sqlTemplate);

        return pJdbcTemplate.query(sqlTemplate,
                                   params,
                                   new RowMapperResultSetExtractor<>(
                                           new RecordRowMapper()
                                   ));
    }

    public List<Record> findAll(ResourceQualifier tableQualifier) {
        final MapSqlParameterSource params = new MapSqlParameterSource();

        String sqlTemplate = String.format("SELECT * FROM %s.%s ", tableQualifier.getSchema(),
                                           tableQualifier.getTable());

        log.debug("Request find all: [{}]", sqlTemplate);

        List<Record> records = new ArrayList<>();
        try {
            records = pJdbcTemplate.query(sqlTemplate,
                                          params,
                                          new RowMapperResultSetExtractor<>(
                                                  new RecordRowMapper()
                                          ));
        } catch (BadSqlGrammarException e) {
            log.warn("Не удалось получить данные из {}, ошибка: {}", tableQualifier, e.getMessage());
        }

        return records;
    }

    public long getTotalByPath(ResourceQualifier tableQualifier, String path, String title) {
        String sqlTemplate = "SELECT count(*) FROM " + tableQualifier +
                "  WHERE path = '" + path + "'" +
                "  AND LOWER(title) LIKE LOWER('%" + title + "%')";

        log.debug("Request find total by path: [{}]", sqlTemplate);

        return pJdbcTemplate.getJdbcTemplate().queryForObject(sqlTemplate, Long.class);
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

    public void removeRecord(ResourceQualifier tableQualifier, Long id) throws CrgDaoException {
        try {
            pJdbcTemplate.update(
                    String.format("DELETE FROM %s WHERE id = :id", tableQualifier),
                    new MapSqlParameterSource("id", id));
        } catch (Exception e) {
            final String msg = String.format("Не удалось выполнить удаление объекта: '%s' в: '%s'",
                                             id, tableQualifier);

            throw new CrgDaoException(msg, e.getCause());
        }
    }

    @NotNull
    private Map<String, Object> getRecordAsObjectMap(ResultSet rs) throws SQLException {
        final Map<String, Object> selectedRow = new LinkedHashMap<>();

        final ResultSetMetaData metaData = rs.getMetaData();
        final int columnCount = metaData.getColumnCount();
        for (int i = 1; i <= columnCount; i++) {
            selectedRow.put(metaData.getColumnLabel(i), rs.getString(i));
        }

        return selectedRow;
    }

    private DbTable getSimpleDbTable(@NotNull ResourceQualifier rQualifier) {
        final DbSpec spec = new DbSpec();
        final DbSchema dbSchema = spec.addSchema(rQualifier.getSchema());

        return dbSchema.addTable(rQualifier.getTable());
    }
}
