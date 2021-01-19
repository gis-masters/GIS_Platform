package ru.mycrg.data_service.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.repository.ProcessRepository;
import ru.mycrg.mq_queue_contract.enums.ProcessStatus;

import java.util.Optional;

@Service
public class ProcessDao {

    public static final Logger log = LoggerFactory.getLogger(ProcessDao.class);

    private final CrgDataSourcesPool crgDataSourcesPool;
    private final ProcessRepository processRepository;

    public ProcessDao(ProcessRepository processRepository,
                      CrgDataSourcesPool crgDataSourcesPool) {
        this.crgDataSourcesPool = crgDataSourcesPool;
        this.processRepository = processRepository;
    }

    public Process save(Process process) {
        return processRepository.save(process);
    }

    public Optional<Process> findById(Long id, String dbName) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(crgDataSourcesPool.getDataSource(dbName));

        final Process process = jdbcTemplate.queryForObject("SELECT * FROM processes WHERE id = ?",
                                                            new Object[]{id},
                                                            new ProcessRowMapper());

        return Optional.ofNullable(process);
    }

    public void updateStatus(Long id, ProcessStatus status, String dbName) {
        NamedParameterJdbcTemplate jdbcTemplate = new NamedParameterJdbcTemplate(
                crgDataSourcesPool.getDataSource(dbName));

        final MapSqlParameterSource source = new MapSqlParameterSource()
                .addValue("status", status.name())
                .addValue("rowId", id);
        jdbcTemplate.update("UPDATE processes SET status = :status WHERE id = :rowId", source);
    }
}
