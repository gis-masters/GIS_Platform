package ru.mycrg.data_service.service.cqrs.tasks.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.auth_facade.UserDetails;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.TaskLogDto;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.TaskLogService;
import ru.mycrg.data_service.service.TaskService;
import ru.mycrg.data_service.service.cqrs.tasks.requests.UpdateTaskRequest;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service.service.smev3.request.accept_rns.AcceptRnsService;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import java.util.List;
import java.util.Map;

import static java.time.LocalDateTime.now;
import static ru.mycrg.data_service.service.TaskService.TASKS_SCHEMA;
import static ru.mycrg.data_service.service.TaskService.TASK_QUALIFIER;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.recordQualifier;
import static ru.mycrg.data_service.service.smev3.fields.CommonFields.RNS_CONTENT_TYPE;
import static ru.mycrg.data_service.service.smev3.fields.CommonFields.STATUS;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.*;
import static ru.mycrg.data_service_contract.enums.TaskStatus.DONE;
import static ru.mycrg.data_service_contract.enums.TaskStatus.IN_PROGRESS;

@Component
public class UpdateTaskRequestHandler implements IRequestHandler<UpdateTaskRequest, Voidy> {

    private final RecordsDao recordsDao;
    private final TaskService taskService;
    private final TaskLogService taskLogService;
    private final AcceptRnsService acceptRnsService;
    private final ISchemaTemplateService schemaService;
    private final IAuthenticationFacade authenticationFacade;

    public UpdateTaskRequestHandler(RecordsDao recordsDao,
                                    TaskService taskService,
                                    TaskLogService taskLogService,
                                    AcceptRnsService acceptRnsService,
                                    ISchemaTemplateService schemaService,
                                    IAuthenticationFacade authenticationFacade) {
        this.recordsDao = recordsDao;
        this.taskService = taskService;
        this.schemaService = schemaService;
        this.taskLogService = taskLogService;
        this.acceptRnsService = acceptRnsService;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public Voidy handle(UpdateTaskRequest request) {
        Long taskId = request.getTaskId();

        Map<String, Object> task = taskService.getById(taskId);

        UserDetails userDetails = authenticationFacade.getUserDetails();
        Long ownerId = Long.valueOf(task.get("owner_id").toString());
        List<Long> directMinions = userDetails.getDirectMinions();
        if (!userDetails.getUserId().equals(ownerId) && !directMinions.contains(ownerId)) {
            throw new BadRequestException(
                    "Возможно редактировать только свои задачи или задачи своих непосредственных подчиненных");
        }

        IRecord newTask = request.getNewTask();
        Object contentType = task.get(CONTENT_TYPE_ID.name());
        if (contentType != null && contentType.toString().equals(RNS_CONTENT_TYPE)) {
            String status = newTask.getAsString(STATUS);
            if (status != null) {
                if (IN_PROGRESS.name().equals(status)) {
                    acceptRnsService.updateTablesAndSendStatusMessageToSmev(task, IN_PROGRESS, taskId);
                }

                if (DONE.name().equals(status)) {
                    acceptRnsService.updateTablesAndSendStatusMessageToSmev(task, DONE, taskId);
                }
            }
        }

        SchemaDto tasksSchema = this.schemaService
                .getSchemaByName(TASKS_SCHEMA)
                .orElseThrow(() -> new NotFoundException("Не найдена схема задач: " + TASKS_SCHEMA));

        Map<String, Object> dataForUpdate = newTask.getContent();
        dataForUpdate.put(UPDATED_BY.getName(), userDetails.getUserId());
        dataForUpdate.put(LAST_MODIFIED.getName(), now());

        try {
            recordsDao.updateRecordById(recordQualifier(TASK_QUALIFIER, taskId), dataForUpdate, tasksSchema);

            Map<String, Object> updatedTask = taskService.getById(taskId);

            taskLogService.create(new TaskLogDto("Изменение задачи", (Long) updatedTask.get(ID.getName())),
                                  updatedTask);
        } catch (CrgDaoException e) {
            throw new DataServiceException("Не удалось обновить статус задачи: " + taskId);
        }

        return new Voidy();
    }
}
