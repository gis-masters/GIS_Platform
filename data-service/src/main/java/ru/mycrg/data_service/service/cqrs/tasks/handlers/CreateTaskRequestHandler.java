package ru.mycrg.data_service.service.cqrs.tasks.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.auth_facade.UserDetails;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.ddl.DdlTablesSpecial;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.TaskLogDto;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.service.TaskLogService;
import ru.mycrg.data_service.service.cqrs.tasks.requests.CreateTaskRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequestHandler;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static ru.mycrg.data_service.util.TableUtils.throwIfNotMatchTableColumns;
import static ru.mycrg.data_service_contract.enums.TaskStatus.CREATED;

@Component
public class CreateTaskRequestHandler implements IRequestHandler<CreateTaskRequest, IRecord> {

    private final Logger log = LoggerFactory.getLogger(CreateTaskRequestHandler.class);

    private final RecordsDao recordsDao;
    private final TaskLogService taskLogService;
    private final DdlTablesSpecial ddlTablesSpecial;
    private final IAuthenticationFacade authenticationFacade;

    public CreateTaskRequestHandler(RecordsDao recordsDao,
                                    TaskLogService taskLogService,
                                    DdlTablesSpecial ddlTablesSpecial,
                                    IAuthenticationFacade authenticationFacade) {
        this.recordsDao = recordsDao;
        this.taskLogService = taskLogService;
        this.ddlTablesSpecial = ddlTablesSpecial;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public IRecord handle(CreateTaskRequest request) {
        try {
            SchemaDto schema = request.getSchema();
            RecordEntity record = request.getRecord();
            ResourceQualifier qualifier = request.getQualifier();

            log.debug("try create task: {}", record);

            String ownerAsString = record.getAsString("owner_id");
            if (ownerAsString == null) {
                throw new BadRequestException("Отсутствует обязательное поле: owner_id");
            }
            UserDetails userDetails = authenticationFacade.getUserDetails();
            List<Long> directMinions = userDetails.getDirectMinions();

            String assignedAsString = record.getAsString("assigned_to");
            if (Objects.nonNull(assignedAsString)) {
                Long assignedTo = Long.valueOf(assignedAsString);
                if (!userDetails.getUserId().equals(assignedTo) && !directMinions.contains(assignedTo)) {
                    throw new BadRequestException(
                            "Задачу можно назначить только на своего непосредственного подчиненного");
                }
            }

            Map<String, Object> props = record.getContent();
            props.put("status", CREATED.name());
            props.put("created_by", userDetails.getUserId());

            throwIfNotMatchTableColumns(props.keySet(), ddlTablesSpecial.getAllColumnNames(qualifier.getTable()));

            IRecord newTask = recordsDao.addRecord(qualifier, record, schema);

            taskLogService.create(new TaskLogDto("Создание новой задачи", newTask.getId()), newTask.getContent());

            return newTask;
        } catch (CrgDaoException e) {
            if (e.hasErrors()) {
                List<ErrorInfo> errorInfoList = new ArrayList<>();
                e.getErrors().forEach((field, msg) -> errorInfoList.add(new ErrorInfo(field, msg)));

                throw new BadRequestException(e.getMessage(), errorInfoList);
            } else {
                throw new DataServiceException(e.getMessage(), e.getCause());
            }
        }
    }
}
