package ru.mycrg.data_service.dao;

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
            StringBuilder propertiesPart = new StringBuilder().append("id");
            StringBuilder valuesPart = new StringBuilder().append("'").append(id).append("'");

            StringBuilder initialPart = new StringBuilder()
                    .append("INSERT INTO ")
                    .append(resourceIdentifier.toString());

            body.forEach((key, value) -> {
                propertiesPart
                        .append(", ")
                        .append(key);

                valuesPart
                        .append(", :")
                        .append(key);
            });

            String insertQuery = String.format("%s (%s) values (%s)",
                                               initialPart.toString(), propertiesPart.toString(),
                                               valuesPart.toString());

            log.debug("INSERT_QUERY: {}", insertQuery);

            pJdbcTemplate.update(insertQuery, body);

            return id;
        } catch (DataAccessException e) {
            throw new CrgDaoException("Не удалось выполнить вставку в таблицу: " + resourceIdentifier.toString());
        } catch (Exception e) {
            throw new CrgDaoException("Что то пошло не так при вставке в таблицу: " + resourceIdentifier.toString());
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

    public Page<Map<String, Object>> findAllPaged(ResourceIdentifier rIdentifier, Pageable pageable)
            throws CrgDaoException {
        Integer total = countTotalRecords(rIdentifier);

        final var result = pJdbcTemplate.query(
                String.format("SELECT * FROM %s LIMIT :limit OFFSET :offset", rIdentifier.toString()),
                new MapSqlParameterSource()
                        .addValue("limit", pageable.getPageSize())
                        .addValue("offset", pageable.getOffset()),
                (rs, rowNum) -> getRecordAsObjectMap(rs));

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
}
