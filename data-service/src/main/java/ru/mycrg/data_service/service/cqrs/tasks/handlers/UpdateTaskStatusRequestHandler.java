package ru.mycrg.data_service.service.cqrs.tasks.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.auth_facade.UserDetails;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.common_contracts.generated.data_service.TaskLogDto;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.TaskLogService;
import ru.mycrg.data_service.service.TaskService;
import ru.mycrg.data_service.service.cqrs.tasks.requests.UpdateTaskStatusRequest;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
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
import static java.util.Objects.nonNull;
import static ru.mycrg.data_service.service.TaskService.TASKS_SCHEMA;
import static ru.mycrg.data_service.service.TaskService.TASK_QUALIFIER;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.recordQualifier;
import static ru.mycrg.data_service.service.smev3.fields.CommonFields.*;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.*;
import static ru.mycrg.data_service_contract.enums.TaskStatus.*;

/**
 * @deprecated Используйте {@link UpdateTaskRequestHandler} вместо этого класса. Там более актуальный код, на данный
 * момент по обновлению статусов.
 */
@Deprecated
@Component
public class UpdateTaskStatusRequestHandler implements IRequestHandler<UpdateTaskStatusRequest, Voidy> {

    private final RecordsDao recordsDao;
    private final TaskService taskService;
    private final ISchemaTemplateService schemaService;
    private final TaskLogService taskLogService;
    private final IAuthenticationFacade authenticationFacade;
    private final AcceptRnsService acceptRnsService;
    private final AcceptRnvService acceptRnvService;
    private final AcceptGpzuService acceptGpzuService;

    public UpdateTaskStatusRequestHandler(RecordsDao recordsDao,
                                          TaskService taskService,
                                          ISchemaTemplateService schemaService,
                                          TaskLogService taskLogService,
                                          IAuthenticationFacade authenticationFacade,
                                          AcceptRnsService acceptRnsService,
                                          AcceptRnvService acceptRnvService,
                                          AcceptGpzuService acceptGpzuService) {
        this.recordsDao = recordsDao;
        this.taskService = taskService;
        this.schemaService = schemaService;
        this.taskLogService = taskLogService;
        this.authenticationFacade = authenticationFacade;
        this.acceptRnsService = acceptRnsService;
        this.acceptRnvService = acceptRnvService;
        this.acceptGpzuService = acceptGpzuService;
    }

    @Override
    public Voidy handle(UpdateTaskStatusRequest request) {
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
        dataForUpdate.put(LAST_MODIFIED.getName(), now());

        TaskStatus newStatus = request.getTaskStatus();
        if (nonNull(newStatus)) {
            dataForUpdate.put("status", newStatus.toString());
        }

        Object contentType = task.get(CONTENT_TYPE_ID.getName());
        if (contentType != null && (newStatus == IN_PROGRESS || newStatus == DONE || newStatus == CANCELED)) {
            String contentTypeString = contentType.toString();
            if (contentTypeString.equals(RNS_CONTENT_TYPE)) {
                acceptRnsService.updateTablesAndSendStatusMessageToSmev(task, newStatus, taskId);
            } else if (contentTypeString.equals(RNV_CONTENT_TYPE)) {
                acceptRnvService.updateTablesAndSendStatusMessageToSmev(task, newStatus, taskId);
            } else if (contentTypeString.equals(GPZU_CONTENT_TYPE)) {
                acceptGpzuService.updateTablesAndSendStatusMessageToSmev(task, newStatus, taskId);
            }
        }

        SchemaDto tasksSchema = this.schemaService
                .getSchemaByName(TASKS_SCHEMA)
                .orElseThrow(() -> new NotFoundException("Не найдена схема задач: " + TASKS_SCHEMA));

        try {
            recordsDao.updateRecordById(recordQualifier(TASK_QUALIFIER, taskId),
                                        dataForUpdate,
                                        tasksSchema);

            Map<String, Object> updatedTask = taskService.getById(taskId);
            taskLogService.create(
                    new TaskLogDto("Статус задачи обновлён на: " + newStatus.getTranslatedStatus(),
                                   taskId,
                                   userDetails.getUserId()),
                    updatedTask
            );
        } catch (CrgDaoException e) {
            throw new DataServiceException("Не удалось обновить статус задачи: " + taskId);
        }

        return new Voidy();
    }
}
