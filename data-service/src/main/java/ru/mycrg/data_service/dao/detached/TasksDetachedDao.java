package ru.mycrg.data_service.dao.detached;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service_contract.enums.TaskStatus;

import java.time.format.DateTimeFormatter;

import static java.time.LocalDateTime.now;
import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;

@Repository
public class TasksDetachedDao {

    private final Logger log = LoggerFactory.getLogger(TasksDetachedDao.class);

    private final DatasourceFactory datasourceFactory;

    public TasksDetachedDao(DatasourceFactory datasourceFactory) {
        this.datasourceFactory = datasourceFactory;
    }

    public void closeOldTasks(Long orgId, int deadlineTime) {
        String databaseName = getDefaultDatabaseName(orgId);

        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(databaseName));

        String status = TaskStatus.DONE.toString();
        String dateTime = now().minusHours(deadlineTime).format(DateTimeFormatter.ISO_DATE_TIME);

        log.debug("dateTime: {}", dateTime);

        int updatedCounter = jdbcTemplate
                .update("UPDATE data.tasks " +
                                "SET status = '" + status + "', last_modified = now() " +
                                "WHERE status <> 'DONE' AND content_type_id <> 'common_task_kpt_order' AND last_modified <= '" + dateTime + "'");

        log.debug("Найдено и переведено в статус '{}' [{}] задач", status, updatedCounter);
    }

    public void closeOldKptTasks(Long orgId, int deadlineTime) {
        String databaseName = getDefaultDatabaseName(orgId);

        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(databaseName));

        String status = TaskStatus.DONE.toString();
        String dateTime = now().minusHours(deadlineTime).format(DateTimeFormatter.ISO_DATE_TIME);

        log.debug("dateTime: {}", dateTime);

        int updatedCounter = jdbcTemplate
                .update("UPDATE data.tasks " +
                        "SET status = '" + status + "', last_modified = now() " +
                        "WHERE status <> 'DONE' AND content_type_id = 'common_task_kpt_order' AND created_at <= '" + dateTime + "'");

        log.debug("Найдено и переведено в статус '{}' [{}] КПТ задач", status, updatedCounter);
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
                status = TaskStatus.valueOf(statusString);
            } catch (IllegalArgumentException e) {
                log.error("Неизвестный статус задачи '{}'", statusString);
            }
        }

        return status;
    }
}
