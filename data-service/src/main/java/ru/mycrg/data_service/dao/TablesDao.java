package ru.mycrg.data_service.dao;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;

import java.sql.ResultSetMetaData;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class TablesDao {

    public static final Logger log = LoggerFactory.getLogger(TablesDao.class);

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public TablesDao(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
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

            jdbcTemplate.update(insertQuery, body);

            return id;
        } catch (DataAccessException e) {
            throw new CrgDaoException("Не удалось выполнить вставку в таблицу: " + resourceIdentifier.toString());
        } catch (Exception e) {
            throw new CrgDaoException("Что то пошло не так при вставке в таблицу: " + resourceIdentifier.toString());
        }
    }

    public Optional<Map<String, Object>> findById(ResourceIdentifier rIdentifier, UUID id) {
        try {
            final var object = jdbcTemplate.queryForObject(
                    String.format("SELECT * FROM %s WHERE id = :id", rIdentifier.toString()),
                    new MapSqlParameterSource("id", id),
                    (rs, rowNum) -> {
                        final Map<String, Object> selectedRow = new LinkedHashMap<>();

                        final ResultSetMetaData metaData = rs.getMetaData();
                        final int columnCount = metaData.getColumnCount();
                        for (int i = 1; i <= columnCount; i++) {
                            selectedRow.put(metaData.getColumnLabel(i), rs.getString(i));
                        }

                        return selectedRow;
                    });

            return Optional.ofNullable(object);
        } catch (DataAccessException e) {
            return Optional.empty();
        }
    }

    public void removeRecord(ResourceIdentifier rIdentifier, UUID id) {
        jdbcTemplate.update(
                String.format("DELETE FROM %s WHERE id = :id", rIdentifier.toString()),
                new MapSqlParameterSource("id", id));
    }
}
