package ru.mycrg.data_service.service.cqrs.tasks.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.auth_facade.UserDetails;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.TaskLogDto;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.TaskLogService;
import ru.mycrg.data_service.service.TaskService;
import ru.mycrg.data_service.service.cqrs.tasks.requests.UpdateTaskStatusRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.util.DateTimeUtil;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.enums.TaskStatus;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.util.Objects.nonNull;
import static ru.mycrg.data_service.service.TaskService.TASKS_SCHEMA;
import static ru.mycrg.data_service.service.TaskService.TASK_QUALIFIER;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.LAST_MODIFIED;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.UPDATED_BY;

@Component
public class UpdateTaskStatusRequestHandler implements IRequestHandler<UpdateTaskStatusRequest, Voidy> {

    private final RecordsDao recordsDao;
    private final TaskService taskService;
    private final SchemaService schemaService;
    private final TaskLogService taskLogService;
    private final IAuthenticationFacade authenticationFacade;

    public UpdateTaskStatusRequestHandler(RecordsDao recordsDao,
                                          TaskService taskService,
                                          SchemaService schemaService,
                                          TaskLogService taskLogService,
                                          IAuthenticationFacade authenticationFacade) {
        this.recordsDao = recordsDao;
        this.taskService = taskService;
        this.schemaService = schemaService;
        this.taskLogService = taskLogService;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public Voidy handle(UpdateTaskStatusRequest request) {
        TaskStatus newStatus = request.getTaskStatus();
        Long taskId = request.getTaskId();

        Map<String, Object> task = taskService.getById(taskId);

        UserDetails userDetails = authenticationFacade.getUserDetails();
        Long ownerId = Long.valueOf(task.get("owner_id").toString());
        List<Long> directMinions = userDetails.getDirectMinions();
        if (!userDetails.getUserId().equals(ownerId) && !directMinions.contains(ownerId)) {
            throw new BadRequestException(
                    "Разрешено редактировать только свои задачи или задачи своих непосредственных подчиненных");
        }

        Map<String, Object> dataForUpdate = new HashMap<>();
        dataForUpdate.put(UPDATED_BY.getName(), userDetails.getUserId());
        dataForUpdate.put(LAST_MODIFIED.getName(), DateTimeUtil.now());

        if (nonNull(newStatus)) {
            dataForUpdate.put("status", newStatus.toString());
        }

        SchemaDto tasksSchema = this.schemaService
                .getSchemaByName(TASKS_SCHEMA)
                .orElseThrow(() -> new NotFoundException("Не найдена схема задач: " + TASKS_SCHEMA));

        try {
            recordsDao.updateRecordById(new ResourceQualifier(TASK_QUALIFIER, taskId),
                                        dataForUpdate,
                                        tasksSchema);

            Map<String, Object> updatedTask = taskService.getById(taskId);
            taskLogService.create(
                    new TaskLogDto("Статус задачи обновлён на: " + newStatus.getTranslatedStatus(), taskId),
                    updatedTask
            );
        } catch (CrgDaoException e) {
            throw new DataServiceException("Не удалось обновить статус задачи: " + taskId);
        }

        return new Voidy();
    }
}
