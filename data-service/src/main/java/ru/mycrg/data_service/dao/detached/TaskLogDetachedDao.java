package ru.mycrg.data_service.dao.detached;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.jetbrains.annotations.Nullable;
import org.postgresql.util.PGobject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.common_contracts.generated.data_service.TaskLogDto;

import java.sql.SQLException;
import java.sql.Types;
import java.time.LocalDateTime;

import static java.sql.Types.BIGINT;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

@Repository
public class TaskLogDetachedDao {

    private final Logger log = LoggerFactory.getLogger(TaskLogDetachedDao.class);
    private final DatasourceFactory datasourceFactory;

    public TaskLogDetachedDao(DatasourceFactory datasourceFactory) {
        this.datasourceFactory = datasourceFactory;
    }

    public void createTaskLog(String dbName,
                              TaskLogDto taskLogDto,
                              Object body,
                              @Nullable String datasourceId) {
        PGobject message = new PGobject();
        message.setType("jsonb");

        try {
            message.setValue(mapper.writeValueAsString(body));
        } catch (SQLException | JsonProcessingException ex) {
            log.error("Ошибка преобразования сообщения лога в jsonb");
        }

        String taskIdField = "task_id";
        String eventTypeField = "event_type";
        String messageField = "message";
        String createdAtField = "created_at";
        String createdByField = "created_by";

        NamedParameterJdbcTemplate pJdbcTemplate = (datasourceId == null)
                ? new NamedParameterJdbcTemplate(datasourceFactory.getDataSource(dbName))
                : new NamedParameterJdbcTemplate(datasourceFactory.getNamedDataSource(dbName, datasourceId));

        String query = String.format(
                "INSERT INTO data.tasks_log (%s,%s,%s,%s,%s) values (:%s,:%s,:%s,:%s,:%s)",
                taskIdField, eventTypeField, messageField, createdAtField, createdByField,
                taskIdField, eventTypeField, messageField, createdAtField, createdByField
        );
        log.debug("INSERT TASK LOG QUERY: [{}]", query);

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue(taskIdField, taskLogDto.getTaskId(), BIGINT);
        params.addValue(eventTypeField, taskLogDto.getEventType(), Types.VARCHAR);
        params.addValue(messageField, message, Types.OTHER);
        params.addValue(createdAtField, LocalDateTime.now(), Types.TIMESTAMP);
        params.addValue(createdByField, taskLogDto.getCreatedBy(), BIGINT);
        try {
            pJdbcTemplate.update(query, params);
        } catch (Exception ex) {
            log.error("Не удалось создать task_log", ex);
        }
    }
}
