package ru.mycrg.data_service.dao;

import lombok.extern.log4j.Log4j2;
import org.jetbrains.annotations.NotNull;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.service.TableIdentifier;

import java.sql.ResultSetMetaData;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Log4j2
@Service
public class TablesDao {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public TablesDao(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public UUID addRecord(@NotNull TableIdentifier tableIdentifier,
                          @NotNull Map<String, Object> body) throws CrgDaoException {
        try {
            UUID id = UUID.randomUUID();
            StringBuilder propertiesPart = new StringBuilder().append("id");
            StringBuilder valuesPart = new StringBuilder().append("'").append(id).append("'");

            StringBuilder initialPart = new StringBuilder()
                    .append("INSERT INTO ")
                    .append(tableIdentifier.toSqlQueryId());

            body.forEach((key, value) -> {
                propertiesPart
                        .append(", ")
                        .append(key);

                valuesPart
                        .append(", :")
                        .append(key);
            });

            String INSERT_QUERY = String.format("%s (%s) values (%s)",
                    initialPart.toString(), propertiesPart.toString(), valuesPart.toString());

            log.debug("INSERT_QUERY: {}", INSERT_QUERY);

            jdbcTemplate.update(INSERT_QUERY, body);

            return id;
        } catch (DataAccessException e) {
            log.error("Не удалось выполнить вставку в таблицу {}: {}", tableIdentifier.toString(), e.getLocalizedMessage());

            throw new CrgDaoException(e.getCause().getLocalizedMessage());
        } catch (Exception e) {
            log.error("Что то пошло не так при вставке в таблицу {}: {}", tableIdentifier.toString(), e.getLocalizedMessage());

            throw new CrgDaoException("Что то пошло не так при вставке в таблицу: " + tableIdentifier.toString());
        }
    }

    public Optional<LinkedHashMap> findById(TableIdentifier tableIdentifier, UUID id) {
        try {
            final var object = jdbcTemplate.queryForObject(
                    String.format("SELECT * FROM %s WHERE id = :id", tableIdentifier.toSqlQueryId()),
                    new MapSqlParameterSource("id", id),
                    (rs, rowNum) -> {
                        final LinkedHashMap<String, Object> selectedRow = new LinkedHashMap<>();

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

    public void removeRecord(TableIdentifier tableIdentifier, UUID id) {
        jdbcTemplate.update(
                String.format("DELETE FROM %s WHERE id = :id", tableIdentifier.toSqlQueryId()),
                new MapSqlParameterSource("id", id));
    }
}
