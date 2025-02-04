package ru.mycrg.data_service.dao.detached;

import com.fasterxml.jackson.databind.JsonNode;
import org.postgresql.util.PGobject;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.dao.mappers.ProcessRowMapper;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service_contract.enums.ProcessStatus;

import java.sql.SQLException;
import java.util.Optional;

@Repository
public class ProcessDao {

    private final DatasourceFactory datasourceFactory;

    public ProcessDao(DatasourceFactory datasourceFactory) {
        this.datasourceFactory = datasourceFactory;
    }

    public Optional<Process> findById(Long id, String dbName) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(dbName));

        final Process process = jdbcTemplate.queryForObject("SELECT * FROM processes WHERE id = ?",
                                                            new Object[]{id},
                                                            new ProcessRowMapper());

        return Optional.ofNullable(process);
    }

    public void updateStatus(Long id, ProcessStatus status, String dbName) {
        NamedParameterJdbcTemplate jdbcTemplate = new NamedParameterJdbcTemplate(
                datasourceFactory.getDataSource(dbName));

        final MapSqlParameterSource source = new MapSqlParameterSource()
                .addValue("status", status.name())
                .addValue("rowId", id);
        jdbcTemplate.update("UPDATE processes SET status = :status WHERE id = :rowId", source);
    }

    public void updateDetailsAndStatus(Long id, ProcessStatus status, String dbName, JsonNode details)
            throws SQLException {
        NamedParameterJdbcTemplate jdbcTemplate = new NamedParameterJdbcTemplate(
                datasourceFactory.getDataSource(dbName));

        PGobject pgDetails = new PGobject();
        pgDetails.setType("json");
        pgDetails.setValue(details.toString());

        final MapSqlParameterSource source = new MapSqlParameterSource()
                .addValue("details", pgDetails)
                .addValue("status", status.name())
                .addValue("rowId", id);

        jdbcTemplate.update("UPDATE processes SET status = :status, details = :details WHERE id = :rowId", source);
    }
}
