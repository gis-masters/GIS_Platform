package ru.mycrg.data_service.dao;

import com.healthmarketscience.sqlbuilder.InsertQuery;
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

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.*;

import static ru.mycrg.data_service.service.SystemLibraryAttributes.ID;
import static ru.mycrg.data_service.service.SystemLibraryAttributes.PARENT;

@Service
@Transactional
public class TablesDao {

    public static final Logger log = LoggerFactory.getLogger(TablesDao.class);

    private final NamedParameterJdbcTemplate pJdbcTemplate;

    public TablesDao(NamedParameterJdbcTemplate parameterJdbcTemplate) {
        this.pJdbcTemplate = parameterJdbcTemplate;
    }

    public UUID addRecord(@NotNull ResourceIdentifier resourceIdentifier,
                          @NotNull Map<String, Object> body) throws CrgDaoException {
        try {
            UUID id = UUID.randomUUID();

            final DbTable table = getDbTable(resourceIdentifier);
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
                                       resourceIdentifier.toString(), e.getCause().getMessage());
            throw new CrgDaoException(msg);
        } catch (Exception e) {
            String msg = String.format("Что то пошло не так при вставке в таблицу: '%s'. %s",
                                       resourceIdentifier.toString(), e.getCause().getMessage());
            throw new CrgDaoException(msg);
        }
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

    public Page<Map<String, Object>> findAllPaged(ResourceIdentifier rIdentifier, Pageable pageable, String parent)
            throws CrgDaoException {
        Integer total = countTotalRecords(rIdentifier);

        MapSqlParameterSource paramSource = new MapSqlParameterSource();
        String query;
        if (parent.isEmpty()) {
            query = String.format("SELECT * FROM %s where parent is NULL LIMIT :limit OFFSET :offset",
                                  rIdentifier.toString());
        } else {
            paramSource.addValue(PARENT.getName(), parent);
            query = String.format("SELECT * FROM %s where parent::text = :parent LIMIT :limit OFFSET :offset",
                                  rIdentifier.toString());
        }

        paramSource.addValue("limit", pageable.getPageSize())
                   .addValue("offset", pageable.getOffset());

        final var result = pJdbcTemplate.query(query, paramSource, (rs, rowNum) -> getRecordAsObjectMap(rs));

        return new PageImpl<>(result, pageable, total);
    }

    @NotNull
    public Integer countTotalRecords(ResourceIdentifier rIdentifier) throws CrgDaoException {
        try {
            Integer result = pJdbcTemplate.getJdbcTemplate().queryForObject(
                    String.format("SELECT count(1) FROM %s", rIdentifier.toString()),
                    (rs, rowNum) -> rs.getInt(1));

            return Objects.requireNonNull(result);
        } catch (DataAccessException e) {
            log.error(e.getMessage());
            throw new CrgDaoException("Failed count total records for: " + rIdentifier.toString(), e.getCause());
        }
    }

    public void removeRecord(ResourceIdentifier rIdentifier, UUID id) {
        pJdbcTemplate.update(
                String.format("DELETE FROM %s WHERE id = :id", rIdentifier.toString()),
                new MapSqlParameterSource("id", id));
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

    private DbTable getDbTable(@NotNull ResourceIdentifier resourceIdentifier) {
        final DbSpec spec = new DbSpec();
        final DbSchema schema = spec.addSchema(resourceIdentifier.getParent().getId());

        return schema.addTable(resourceIdentifier.getId());
    }
}
