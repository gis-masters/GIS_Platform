package ru.mycrg.data_service.service;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.BaseDao;
import ru.mycrg.data_service.entity.Task;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.TaskRepository;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.List;

import static java.util.Objects.nonNull;

@Service
@Transactional(readOnly = true)
public class TaskService {

    private final Logger log = LoggerFactory.getLogger(TaskService.class);

    private final TaskRepository taskRepository;
    private final BaseDao baseDao;

    public TaskService(TaskRepository taskRepository, BaseDao baseDao) {
        this.taskRepository = taskRepository;
        this.baseDao = baseDao;
    }

    @NotNull
    public Page<Task> findAll(String ecqlFilter, Pageable pageable) {
        List<Task> tasks;
        ResourceQualifier taskTable = new ResourceQualifier("data", "tasks");
        try {
            tasks = baseDao.findAll(taskTable, ecqlFilter, pageable, Task.class);
        } catch (BadSqlGrammarException ex) {
            String message = "Не удалось выполнить запрос на выборку задач. ";
            if (nonNull(ex.getCause()) && nonNull(ex.getCause().getMessage())) {
                message += "Причина: " + ex.getCause().getMessage();
            }
            log.error(message);

            throw new BadRequestException(message);
        }

        long quantityOfTasks = baseDao.getTotal(taskTable, ecqlFilter);

        return new PageImpl<>(tasks, pageable, quantityOfTasks);
    }

    @NotNull
    public Task getById(@NotNull Long id) {
        return taskRepository
                .findById(id)
                .orElseThrow(() -> new NotFoundException(Task.class, id));
    }
}
