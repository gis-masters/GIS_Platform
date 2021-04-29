package ru.mycrg.data_service.dao;

import com.healthmarketscience.sqlbuilder.*;
import com.healthmarketscience.sqlbuilder.custom.postgresql.PgLimitClause;
import com.healthmarketscience.sqlbuilder.dbspec.basic.DbColumn;
import com.healthmarketscience.sqlbuilder.dbspec.basic.DbSchema;
import com.healthmarketscience.sqlbuilder.dbspec.basic.DbSpec;
import com.healthmarketscience.sqlbuilder.dbspec.basic.DbTable;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;
import ru.mycrg.data_service.util.filter.CrgFilter;
import ru.mycrg.data_service.util.filter.FilterCondition;
import ru.mycrg.data_service.util.filter.FilterItem;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.*;

import static ru.mycrg.data_service.util.SystemLibraryAttributes.ID;

@Service
@Transactional
public class TablesDao {

    public static final Logger log = LoggerFactory.getLogger(TablesDao.class);

    private final NamedParameterJdbcTemplate pJdbcTemplate;

    public TablesDao(NamedParameterJdbcTemplate parameterJdbcTemplate) {
        this.pJdbcTemplate = parameterJdbcTemplate;
    }

    public UUID addRecord(@NotNull ResourceIdentifier rIdentifier,
                          @NotNull Map<String, Object> body) throws CrgDaoException {
        try {
            UUID id = UUID.randomUUID();

            final DbTable table = getSimpleDbTable(rIdentifier);
            final DbColumn idColumn = table.addColumn(ID.getName());

            final InsertQuery insertQuery = new InsertQuery(table);
            insertQuery.addColumn(idColumn, id);

            body.forEach((key, value) -> {
                final DbColumn dbColumn = table.addColumn(key);

                insertQuery.addColumn(dbColumn, value);
            });
            String query = insertQuery.validate().toString();

            log.debug("INSERT_QUERY: {}", query);
            pJdbcTemplate.getJdbcTemplate().update(query);

            return id;
        } catch (DataAccessException e) {
            String msg = String.format("Не удалось выполнить вставку в таблицу: '%s'. %s",
                                       rIdentifier.toString(), e.getCause().getMessage());
            throw new CrgDaoException(msg);
        } catch (Exception e) {
            String msg = String.format("Что то пошло не так при вставке в таблицу: '%s'. %s",
                                       rIdentifier.toString(), e.getCause().getMessage());
            throw new CrgDaoException(msg);
        }
    }

    public Page<Map<String, Object>> findPagedByFilter(ResourceIdentifier rIdentifier,
                                                       SchemaDto schema,
                                                       Pageable pageable,
                                                       CrgFilter filter) throws CrgDaoException {
        Integer total = countTotalRecords(rIdentifier);

        final DbTable table = getDbTable(rIdentifier, schema);
        final SelectQuery selectQuery = new SelectQuery().addAllTableColumns(table);

        if (!filter.getFilters().isEmpty()) {
            fillConditions(table, selectQuery, filter.getFilters());
        }

        if (pageable.getOffset() > -1) {
            selectQuery.setOffset(pageable.getOffset());
        }

        if (pageable.getPageSize() > -1) {
            PgLimitClause limitClause = new PgLimitClause(pageable.getPageSize());
            selectQuery.addCustomization(limitClause);
        }

        pageable.getSort().forEach(order -> {
            final String property = order.getProperty();

            final OrderObject.Dir direction = order.getDirection().isAscending()
                    ? OrderObject.Dir.ASCENDING
                    : OrderObject.Dir.DESCENDING;

            final DbColumn column = table.addColumn(property);

            selectQuery.addOrdering(column, direction);
        });

        log.info("SELECT QUERY: {}", selectQuery);

        final var result = pJdbcTemplate.getJdbcTemplate()
                                        .query(selectQuery.toString(), (rs, rowNum) -> getRecordAsObjectMap(rs));

        return new PageImpl<>(result, pageable, total);
    }

    public Optional<Map<String, Object>> findById(ResourceIdentifier rIdentifier, UUID id) {
        try {
            final var object = pJdbcTemplate.queryForObject(
                    String.format("SELECT * FROM %s WHERE id = :id", rIdentifier.toString()),
                    new MapSqlParameterSource("id", id),
                    (rs, rowNum) -> getRecordAsObjectMap(rs));

            return Optional.ofNullable(object);
        } catch (DataAccessException e) {
            return Optional.empty();
        }
    }

    @NotNull
    public Integer countTotalRecords(ResourceIdentifier rIdentifier) throws CrgDaoException {
        try {
            Integer result = pJdbcTemplate.getJdbcTemplate().queryForObject(
                    String.format("SELECT count(1) FROM %s", rIdentifier.toString()),
                    (rs, rowNum) -> rs.getInt(1));

            return Objects.requireNonNull(result);
        } catch (DataAccessException e) {
            throw new CrgDaoException("Failed count total records for: " + rIdentifier.toString(), e.getCause());
        }
    }

    public void removeRecord(ResourceIdentifier rIdentifier, UUID id) throws CrgDaoException {
        try {
            pJdbcTemplate.update(
                    String.format("DELETE FROM %s WHERE id = :id", rIdentifier.toString()),
                    new MapSqlParameterSource("id", id));
        } catch (Exception e) {
            final String msg = String.format("Не удалось выполнить удаление объекта: '%s' в: '%s'",
                                             id, rIdentifier.toString());

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

    private DbTable getDbTable(@NotNull ResourceIdentifier rIdentifier, SchemaDto schema) {
        final DbSpec spec = new DbSpec();
        final DbSchema dbSchema = spec.addSchema(rIdentifier.getParent().getId());
        final DbTable dbTable = dbSchema.addTable(rIdentifier.getId());

        schema.getProperties().forEach(propertyDto -> dbTable.addColumn(propertyDto.getName()));

        return dbTable;
    }

    private DbTable getSimpleDbTable(@NotNull ResourceIdentifier rIdentifier) {
        final DbSpec spec = new DbSpec();
        final DbSchema dbSchema = spec.addSchema(rIdentifier.getParent().getId());

        return dbSchema.addTable(rIdentifier.getId());
    }
}
