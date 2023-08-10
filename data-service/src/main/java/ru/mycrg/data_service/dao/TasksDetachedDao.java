package ru.mycrg.data_service.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service_contract.enums.TaskStatus;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static java.time.LocalDateTime.now;

@Repository
public class TasksDetachedDao {

    private final Logger log = LoggerFactory.getLogger(TasksDetachedDao.class);

    private final DatasourceFactory datasourceFactory;

    public TasksDetachedDao(DatasourceFactory datasourceFactory) {
        this.datasourceFactory = datasourceFactory;
    }

    public void closeOldTasks(String dbName, int deadlineTime) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(dbName));

        String status = TaskStatus.DONE.toString();
        String dateTime = now().minusHours(deadlineTime).format(DateTimeFormatter.ISO_DATE_TIME);

        log.debug("dateTime: {}", dateTime);

        int updatedCounter = jdbcTemplate.update("UPDATE data.tasks " +
                                                         "SET status = '" + status + "', last_modified = now() " +
                                                         "WHERE status <> 'DONE' AND last_modified <= '" + dateTime + "'");

        log.debug("Найдено и переведено в статус '{}' [{}] задач", status, updatedCounter);
    }
}
