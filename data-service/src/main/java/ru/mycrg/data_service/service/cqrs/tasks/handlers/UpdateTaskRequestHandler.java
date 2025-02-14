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
import ru.mycrg.data_service.service.smev3.request.AcceptServiceBase;
import ru.mycrg.data_service.service.smev3.request.accept_gpzu.AcceptGpzuService;
import ru.mycrg.data_service.service.smev3.request.accept_rns.AcceptRnsService;
import ru.mycrg.data_service.service.smev3.request.accept_rnv.AcceptRnvService;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.enums.TaskStatus;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.time.LocalDateTime.now;
import static ru.mycrg.data_service.service.TaskService.*;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.recordQualifier;
import static ru.mycrg.data_service.service.smev3.fields.CommonFields.*;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.*;
import static ru.mycrg.data_service_contract.enums.TaskStatus.*;
import static ru.mycrg.data_service_contract.enums.TaskIntermediateStatus.*;

@Component
public class UpdateTaskRequestHandler implements IRequestHandler<UpdateTaskRequest, Voidy> {

    private final RecordsDao recordsDao;
    private final TaskService taskService;
    private final TaskLogService taskLogService;
    private final AcceptRnsService acceptRnsService;
    private final AcceptRnvService acceptRnvService;
    private final AcceptGpzuService acceptGpzuService;
    private final ISchemaTemplateService schemaService;
    private final IAuthenticationFacade authenticationFacade;

    public UpdateTaskRequestHandler(RecordsDao recordsDao,
                                    TaskService taskService,
                                    TaskLogService taskLogService,
                                    AcceptRnsService acceptRnsService,
                                    AcceptRnvService acceptRnvService,
                                    AcceptGpzuService acceptGpzuService,
                                    ISchemaTemplateService schemaService,
                                    IAuthenticationFacade authenticationFacade) {
        this.recordsDao = recordsDao;
        this.taskService = taskService;
        this.schemaService = schemaService;
        this.taskLogService = taskLogService;
        this.acceptRnsService = acceptRnsService;
        this.acceptRnvService = acceptRnvService;
        this.acceptGpzuService = acceptGpzuService;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public Voidy handle(UpdateTaskRequest request) {
        Long taskId = request.getTaskId();

        Map<String, Object> task = taskService.getById(taskId);

        UserDetails userDetails = authenticationFacade.getUserDetails();
        Long assignedId = Long.valueOf(task.get(TASK_ASSIGNED_TO_PROPERTY).toString());
        List<Long> directMinions = userDetails.getDirectMinions();
        if (!userDetails.getUserId().equals(assignedId) && !directMinions.contains(assignedId)) {
            throw new BadRequestException(
                    "Возможно редактировать только свои задачи или задачи своих непосредственных подчиненных");
        }

        IRecord newTask = request.getNewTask();

        SchemaDto tasksSchema = this.schemaService
                .getSchemaByName(TASKS_SCHEMA)
                .orElseThrow(() -> new NotFoundException("Не найдена схема задач: " + TASKS_SCHEMA));

        Map<String, Object> dataForUpdate = newTask.getContent();
        dataForUpdate.put(UPDATED_BY.getName(), userDetails.getUserId());
        dataForUpdate.put(LAST_MODIFIED.getName(), now());

        try {

            String assignedTo = newTask.getAsString(TASK_ASSIGNED_TO_PROPERTY);
            if (assignedTo != null) {
                dataForUpdate.put(TASK_OWNER_ID_PROPERTY, userDetails.getUserId());
            }

            recordsDao.updateRecordById(recordQualifier(TASK_QUALIFIER, taskId), dataForUpdate, tasksSchema);

            Map<String, Object> updatedTask = taskService.getById(taskId);

            taskLogService.create(new TaskLogDto("Изменение задачи", (Long) updatedTask.get(ID.getName())),
                                  updatedTask);
        } catch (CrgDaoException e) {
            throw new DataServiceException("Не удалось обновить статус задачи: " + taskId);
        }

        Object contentType = task.get(CONTENT_TYPE_ID.getName());
        if (contentType != null) {
            String status = newTask.getAsString(INTERMEDIATE_STATUS);
            if (status != null) {
                switch (contentType.toString()) {
                    case RNS_CONTENT_TYPE:
                        handleStatus(acceptRnsService, status, task, taskId);
                        break;
                    case RNV_CONTENT_TYPE:
                        handleStatus(acceptRnvService, status, task, taskId);
                        break;
                }
            }
        }
        if (contentType != null && contentType.toString().equals(GPZU_CONTENT_TYPE)) {
            String status = newTask.getAsString(STATUS);
            if (status != null) {
                if (IN_PROGRESS.name().equals(status)) {
                    acceptGpzuService.updateTablesAndSendStatusMessageToSmev(task, IN_PROGRESS, taskId);
                }

                if (DONE.name().equals(status)) {
                    acceptGpzuService.updateTablesAndSendStatusMessageToSmev(task, DONE, taskId);
                }

                if (CANCELED.name().equals(status)) {
                    acceptGpzuService.updateTablesAndSendStatusMessageToSmev(task, CANCELED, taskId);
                }
            }
        }

        return new Voidy();
    }

    private void handleStatus(AcceptServiceBase service, String status, Map<String, Object> task, Long taskId) {
        Map<String, TaskStatus> statusActionMap = new HashMap<>();
        statusActionMap.put(APPLICATION_ASSIGNED_TO_PERFORMER.getIntermediateStatus(), IN_PROGRESS);
        statusActionMap.put(DOCUMENTS_READY_TO_SENDING.getIntermediateStatus(), DONE);
        statusActionMap.put(APPLICATION_CANCELED.getIntermediateStatus(), CANCELED);

        TaskStatus taskStatus = statusActionMap.get(status);
        if (taskStatus != null) {
            service.updateTablesAndSendStatusMessageToSmev(task, taskStatus, taskId);
        }
    }
}