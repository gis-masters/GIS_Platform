package ru.mycrg.data_service.service;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.BaseReadDao;
import ru.mycrg.data_service.dao.mappers.RecordRowMapper;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.TASK;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.recordQualifier;
import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.StringUtil.join;

@Service
@Transactional(readOnly = true)
public class TaskService {

    public static final String TASK_TABLE_NAME = "tasks";
    public static final String TASKS_SCHEMA = "tasks_schema_v1";
    public static final ResourceQualifier TASK_QUALIFIER =
            new ResourceQualifier(SYSTEM_SCHEMA_NAME, TASK_TABLE_NAME, TASK);

    public static final String TASK_INTERMEDIATE_STATUS_PROPERTY = "intermediate_status";
    public static final String TASK_TYPE_PROPERTY = "type";
    public static final String TASK_STATUS_PROPERTY = "status";
    public static final String TASK_OWNER_ID_PROPERTY = "owner_id";
    public static final String TASK_ASSIGNED_TO_PROPERTY = "assigned_to";
    public static final String TASK_DESCRIPTION_PROPERTY = "description";

    private final BaseReadDao baseDao;
    private final ISchemaTemplateService schemaService;
    private final IAuthenticationFacade authenticationFacade;

    public TaskService(BaseReadDao baseDao,
                       ISchemaTemplateService schemaService,
                       IAuthenticationFacade authenticationFacade) {
        this.baseDao = baseDao;
        this.schemaService = schemaService;
        this.authenticationFacade = authenticationFacade;
    }

    @NotNull
    public Map<String, Object> getById(@NotNull Long id) {
        return baseDao.findById(recordQualifier(TASK_QUALIFIER, id))
                      .map(IRecord::getContent)
                      .orElseThrow(() -> new NotFoundException("Не найдена задача по id:" + id));
    }

    @NotNull
    public Page<Object> getAll(String ecqlFilter, Pageable pageable) {
        try {
            String filter = ecqlFilter;
            if (!authenticationFacade.isOrganizationAdmin()) {
                filter = modifyFilterByAssignedToMe(ecqlFilter);
            }

            SchemaDto tasksSchema = this.schemaService
                    .getSchemaByName(TASKS_SCHEMA)
                    .orElseThrow(() -> new NotFoundException("Не найдена схема задач: " + TASKS_SCHEMA));

            List<Object> tasks = baseDao.findAll(TASK_QUALIFIER, filter, pageable, new RecordRowMapper(tasksSchema))
                                        .stream()
                                        .map(IRecord::getContent)
                                        .collect(Collectors.toList());
            long total = baseDao.total(TASK_QUALIFIER, filter);

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
}
