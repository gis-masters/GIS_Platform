package ru.mycrg.data_service.dao.detached;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.dao.utils.SqlParameterSourceFactory;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.enums.TaskStatus;
import ru.mycrg.geo_json.Feature;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

import static java.time.LocalDateTime.now;
import static java.time.format.DateTimeFormatter.ISO_DATE_TIME;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildParameterizedInsertQuery;
import static ru.mycrg.data_service.service.TaskService.TASKS_SCHEMA;
import static ru.mycrg.data_service.service.TaskService.TASK_TABLE_NAME;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.systemTable;
import static ru.mycrg.data_service.service.smev3.fields.CommonFields.*;
import static ru.mycrg.data_service.service.import_.kpt.ImportKptService.KPT_IMPORT_CONTENT_TYPE;
import static ru.mycrg.data_service.service.smev3.request.get_cadastrial_plan.GetCadastrialPlanRequestService.KPT_ORDER_CONTENT_TYPE;
import static ru.mycrg.data_service_contract.enums.TaskStatus.*;
import static ru.mycrg.data_service_contract.enums.TaskType.ASSIGNABLE;

@Repository
public class TasksDetachedDao {

    private final Logger log = LoggerFactory.getLogger(TasksDetachedDao.class);

    private final DatasourceFactory datasourceFactory;
    private final ISchemaTemplateService schemaService;
    private final SqlParameterSourceFactory sqlParameterSourceFactory;

    public TasksDetachedDao(DatasourceFactory datasourceFactory,
                            ISchemaTemplateService schemaService,
                            SqlParameterSourceFactory sqlParameterSourceFactory) {
        this.datasourceFactory = datasourceFactory;
        this.schemaService = schemaService;
        this.sqlParameterSourceFactory = sqlParameterSourceFactory;
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

    public void closeOldTasks(String databaseName, int deadline) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(databaseName));

        String dateTime = now().minusHours(deadline).format(ISO_DATE_TIME);
        String query = "UPDATE data.tasks " +
                "SET status = '" + DONE + "', " +
                "    last_modified = now() " +
                "WHERE status <> '" + DONE + "' AND " +
                "      content_type_id <> '" + KPT_ORDER_CONTENT_TYPE + "' AND " +
                "      content_type_id <> '" + KPT_IMPORT_CONTENT_TYPE + "' AND " +
                "      content_type_id <> '" + RNS_CONTENT_TYPE + "' AND " +
                "      content_type_id <> '" + RNV_CONTENT_TYPE + "' AND " +
                "      content_type_id <> '" + GPZU_CONTENT_TYPE + "' AND " +
                "      type <> '" + ASSIGNABLE + "' AND " +
                "      last_modified <= '" + dateTime + "'";

        log.debug("Запрос на закрытие старых задач: {}", query);

        int updatedCounter = jdbcTemplate.update(query);

        log.debug("Найдено и закрыто [{}] задач", updatedCounter);
    }

    public void updateStatus(String databaseName, Long taskId, TaskStatus newStatus) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(databaseName));

        jdbcTemplate.update("UPDATE data.tasks " +
                                    "SET status = ?, last_modified = now() " +
                                    "WHERE id = ?", newStatus.toString(), taskId);
        log.debug("Задача {} переведена в статус {}", taskId, newStatus);
    }

    public long createTask(String databaseName, Map<String, Object> payload) {
        NamedParameterJdbcTemplate jdbcTemplate = new NamedParameterJdbcTemplate(
                datasourceFactory.getDataSource(databaseName));

        String query = buildParameterizedInsertQuery(systemTable(TASK_TABLE_NAME),
                                                     new Feature(payload),
                                                     false);
        SchemaDto tasksSchema = this.schemaService
                .getSchemaByName(TASKS_SCHEMA)
                .orElseThrow(() -> new NotFoundException("Не найдена схема задач: " + TASKS_SCHEMA));
        MapSqlParameterSource parameterSource = sqlParameterSourceFactory
                .buildParameterizedSource(new Feature(payload), tasksSchema);
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(query, parameterSource, keyHolder);

        log.debug("Создана задача с id {}", keyHolder.getKeys().get("id"));

        return (long) keyHolder.getKeys().get("id");
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
