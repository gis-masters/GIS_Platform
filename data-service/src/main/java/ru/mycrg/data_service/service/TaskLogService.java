package ru.mycrg.data_service.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.BaseReadDao;
import ru.mycrg.common_contracts.generated.data_service.TaskLogDto;
import ru.mycrg.data_service.entity.TaskLog;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.TaskLogRepository;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.List;

import static java.time.LocalDateTime.now;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.systemTable;
import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

@Service
@Transactional
public class TaskLogService {

    public static final ResourceQualifier TASK_LOG_QUALIFIER = systemTable("tasks_log");

    private final BaseReadDao baseDao;
    private final TaskLogRepository taskLogRepository;

    public TaskLogService(TaskLogRepository taskLogRepository, BaseReadDao baseDao) {
        this.taskLogRepository = taskLogRepository;
        this.baseDao = baseDao;
    }

    @NotNull
    public Page<TaskLog> findAll(String ecqlFilter, Pageable pageable) {
        List<TaskLog> taskLogs;
        try {
            taskLogs = baseDao.findAll(TASK_LOG_QUALIFIER, ecqlFilter, pageable, TaskLog.class);
        } catch (BadSqlGrammarException ex) {
            String message = "Не удалось выполнить запрос на выборку из журнала задач. ";
            logError(message, ex);

            throw new BadRequestException(message);
        }

        long total = baseDao.total(TASK_LOG_QUALIFIER, ecqlFilter);

        return new PageImpl<>(taskLogs, pageable, total);
    }

    @NotNull
    public TaskLog getById(@NotNull Long id) {
        return taskLogRepository
                .findById(id)
                .orElseThrow(() -> new NotFoundException(TaskLog.class, id));
    }

    @NotNull
    public List<TaskLog> getByTaskId(@NotNull Long id) {
        return taskLogRepository
                .findAllByTaskIdIs(id);
    }

    public void create(TaskLogDto logDto, Object taskBody) {
        TaskLog taskLog = new TaskLog();
        taskLog.setTaskId(logDto.getTaskId());
        taskLog.setEventType(logDto.getEventType());
        taskLog.setMassage(mapper.convertValue(taskBody, JsonNode.class));
        taskLog.setCreatedAt(now());
        taskLog.setCreatedBy(logDto.getCreatedBy());

        taskLogRepository.save(taskLog);
    }
}
