package ru.mycrg.data_service.dao.detached;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service_contract.enums.TaskStatus;

import java.sql.Timestamp;
import java.util.List;

import static java.time.LocalDateTime.now;
import static java.time.format.DateTimeFormatter.ISO_DATE_TIME;
import static ru.mycrg.data_service_contract.enums.TaskStatus.*;

@Repository
public class TasksDetachedDao {

    private final Logger log = LoggerFactory.getLogger(TasksDetachedDao.class);

    private final DatasourceFactory datasourceFactory;

    public TasksDetachedDao(DatasourceFactory datasourceFactory) {
        this.datasourceFactory = datasourceFactory;
    }

    public List<Long> findTasksForCancel(String dbName, int deadline, String contentType) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(dbName));

        Timestamp timestamp = Timestamp.valueOf(now().minusHours(deadline));
        log.debug("dateTime: {}", timestamp);

        String query = "SELECT id FROM data.tasks " +
                "WHERE status <> '" + DONE + "' AND " +
                "      status <> '" + CANCELED + "' AND " +
                "      content_type_id = '" + contentType + "' AND " +
                "      created_at <= ?";

        return jdbcTemplate.query(query,
                                  new Object[]{timestamp},
                                  (rs, rowNum) -> rs.getLong("id"));
    }

    public void closeOldTasks(String databaseName, int deadline, String contentType) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(databaseName));

        String dateTime = now().minusHours(deadline).format(ISO_DATE_TIME);
        String query = "UPDATE data.tasks " +
                "SET status = '" + DONE + "', " +
                "    last_modified = now() " +
                "WHERE status <> '" + DONE + "' AND " +
                "      content_type_id <> '" + contentType + "' AND " +
                "      last_modified <= '" + dateTime + "'";

        log.debug("Close old tasks query: {}", query);

        int updatedCounter = jdbcTemplate.update(query);

        log.debug("Найдено и закрыто [{}] задач типа: '{}'", updatedCounter, contentType);
    }

    public void updateStatus(String databaseName, Long taskId, TaskStatus newStatus) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(databaseName));

        jdbcTemplate.update("UPDATE data.tasks " +
                                    "SET status = ?, last_modified = now() " +
                                    "WHERE id = ?", newStatus.toString(), taskId);
        log.debug("Задача {} переведена в статус {}", taskId, newStatus);
    }

    public TaskStatus getTaskStatus(String databaseName, Long taskId) {
        String statusString = null;
        TaskStatus status = null;
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(databaseName));

        try {
            statusString = jdbcTemplate.queryForObject("SELECT t.status FROM data.tasks t WHERE id = ?",
                                                       String.class, taskId);
        } catch (DataAccessException e) {
            log.error("Ошибка получения статуса задачи по id={}", taskId, e);
        }

        if (statusString != null) {
            try {
                status = valueOf(statusString);
            } catch (IllegalArgumentException e) {
                log.error("Неизвестный статус задачи '{}'", statusString);
            }
        }

        return status;
    }
}
