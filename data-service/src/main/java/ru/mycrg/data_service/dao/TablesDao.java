package ru.mycrg.data_service.dao;

import com.healthmarketscience.sqlbuilder.*;
import com.healthmarketscience.sqlbuilder.dbspec.basic.DbColumn;
import com.healthmarketscience.sqlbuilder.dbspec.basic.DbSchema;
import com.healthmarketscience.sqlbuilder.dbspec.basic.DbSpec;
import com.healthmarketscience.sqlbuilder.dbspec.basic.DbTable;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dao.mappers.RecordRowMapper;
import ru.mycrg.data_service.dto.Record;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.util.filter.FilterCondition;
import ru.mycrg.data_service.util.filter.FilterItem;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static ru.mycrg.data_service.dao.SqlBuilder.buildOrderBySection;

@Service
@Transactional
public class TablesDao {

    public static final Logger log = LoggerFactory.getLogger(TablesDao.class);

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

            log.debug("INSERT_QUERY: {}", query);

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

    public long getTotalByPath(ResourceQualifier tableQualifier, String path, String title) {
        String sqlTemplate = "SELECT count(*) FROM " + tableQualifier +
                "  WHERE path = '" + path + "'" +
                "  AND LOWER(title) LIKE LOWER('%" + title + "%')";

        log.debug("Request find total by path: [{}]", sqlTemplate);

        return pJdbcTemplate.getJdbcTemplate().queryForObject(sqlTemplate, Long.class);
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

    private void fillConditions(DbTable table, SelectQuery selectQuery, List<FilterItem> filters) {
        filters.forEach(filterItem -> {
            final FilterCondition condition = filterItem.getCondition();
            final String value = filterItem.getValue();
            final String field = filterItem.getField();

            final DbColumn fieldColumn = table.findColumn(field);
            switch (condition) {
                case IS_NULL:
                    selectQuery.addCondition(UnaryCondition.isNull(fieldColumn));

                    break;
                case EQUAL_TO:
                    selectQuery.addCondition(BinaryCondition.equalTo(fieldColumn, value));

                    break;
                case LIKE:
                    final String likeCondition = String.format("LOWER(%s) LIKE LOWER('%%%s%%')",
                                                               fieldColumn.getColumnNameSQL(), value);
                    selectQuery.addCondition(new CustomCondition(likeCondition));

                    break;
                default:
                    log.warn("Unsupported filter condition: {}", condition);
            }
        });
    }

    private DbTable getDbTable(@NotNull ResourceQualifier rQualifier, SchemaDto schema) {
        final DbSpec spec = new DbSpec();
        final DbSchema dbSchema = spec.addSchema(rQualifier.getSchema());
        final DbTable dbTable = dbSchema.addTable(rQualifier.getTable());

        schema.getProperties().forEach(propertyDto -> dbTable.addColumn(propertyDto.getName()));

        return dbTable;
    }

    private DbTable getSimpleDbTable(@NotNull ResourceQualifier rQualifier) {
        final DbSpec spec = new DbSpec();
        final DbSchema dbSchema = spec.addSchema(rQualifier.getSchema());

        return dbSchema.addTable(rQualifier.getTable());
    }
}
