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
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.BaseDao;
import ru.mycrg.data_service.entity.Task;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.TaskRepository;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.List;

import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.StringUtil.join;

@Service
@Transactional(readOnly = true)
public class TaskService {

    private final Logger log = LoggerFactory.getLogger(TaskService.class);

    private final TaskRepository taskRepository;
    private final BaseDao baseDao;
    private final IAuthenticationFacade authenticationFacade;

    public TaskService(TaskRepository taskRepository,
                       BaseDao baseDao,
                       IAuthenticationFacade authenticationFacade) {
        this.taskRepository = taskRepository;
        this.baseDao = baseDao;
        this.authenticationFacade = authenticationFacade;
    }

    @NotNull
    public Page<Task> getAll(String ecqlFilter, Pageable pageable) {
        try {
            ResourceQualifier taskQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, "tasks");
            String filter = ecqlFilter;
            if (!authenticationFacade.isOrganizationAdmin()) {
                filter = modifyFilterByAssignedToMe(ecqlFilter);
            }

            log.debug("filter: {}", filter);

            List<Task> tasks = baseDao.findAll(taskQualifier, filter, pageable, Task.class);
            long total = baseDao.getTotal(taskQualifier, filter);

            return new PageImpl<>(tasks, pageable, total);
        } catch (BadSqlGrammarException ex) {
            String message = "Не удалось выполнить запрос на выборку задач. ";
            logError(message, ex);

            throw new BadRequestException(message);
        } catch (Exception e) {
            String message = "Не удалось получить все задачи.";
            logError(message, e);

            throw new DataServiceException(message);
        }
    }

    private String modifyFilterByAssignedToMe(String ecqlFilter) {
        List<Long> minionIds = authenticationFacade.getUserDetails().getAllMinions();
        Long userId = authenticationFacade.getUserDetails().getUserId();
        minionIds.add(userId);
        String joined = join(minionIds, ", ");

        if (ecqlFilter == null || ecqlFilter.isBlank()) {
            return String.format("owner_id IN (%s) OR assigned_to IN (%s)", joined, userId);
        }

        return String.format("(owner_id IN (%s) OR assigned_to IN (%s)) AND (%s)", joined, userId, ecqlFilter);
    }

    @NotNull
    public Task getById(@NotNull Long id) {
        return taskRepository
                .findById(id)
                .orElseThrow(() -> new NotFoundException(Task.class, id));
    }
}
