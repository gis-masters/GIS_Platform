package ru.mycrg.data_service.controller.tasks;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.dto.record.RecordEntity;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.TaskService;
import ru.mycrg.data_service.service.cqrs.tasks.requests.*;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service.util.EcqlRecordIdHandler;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.Mediator;

import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.CREATED;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.auth_service_contract.Authorities.SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;
import static ru.mycrg.data_service.service.TaskService.TASKS_SCHEMA;
import static ru.mycrg.data_service.service.TaskService.TASK_QUALIFIER;
import static ru.mycrg.data_service.service.schemas.SchemaUtil.excludeUnknownProperties;
import static ru.mycrg.data_service.util.StringUtil.camelCaseToSnakeCaseForEcqlFilter;
import static ru.mycrg.data_service_contract.enums.TaskStatus.*;

@RestController
@RequestMapping(value = "/tasks")
public class TaskController {

    private final Mediator mediator;
    private final TaskService taskService;
    private final ISchemaTemplateService schemaService;

    public TaskController(Mediator mediator, TaskService taskService, ISchemaTemplateService schemaService) {
        this.mediator = mediator;
        this.taskService = taskService;
        this.schemaService = schemaService;
    }

    @GetMapping
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> getAll(
            @RequestParam(name = "filter", required = false, defaultValue = "") String filter,
            @RequestParam(name = "recordId", required = false) List<Long> taskId,
            Pageable pageable) {
        String ecqlFilter = EcqlRecordIdHandler.joinAsIn(filter, taskId);

        Page<Object> tasks = taskService.getAll(camelCaseToSnakeCaseForEcqlFilter(ecqlFilter), pageable);

        return ResponseEntity.ok(pageFromList(tasks, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> getById(@PathVariable Long id) {
        Object task = taskService.getById(id);

        return ResponseEntity.ok(task);
    }

    @PostMapping
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> create(@RequestBody Map<String, Object> body) {
        SchemaDto tasksSchema = this.schemaService
                .getSchemaByName(TASKS_SCHEMA)
                .orElseThrow(() -> new NotFoundException("Не найдена схема задач: " + TASKS_SCHEMA));

        Map<String, Object> props = excludeUnknownProperties(tasksSchema, body);

        IRecord record = mediator.execute(
                new CreateTaskRequest(tasksSchema, TASK_QUALIFIER, new RecordEntity(props)));

        return new ResponseEntity<>(record.getContent(), CREATED);
    }

    @PostMapping("/crateTable/{schemaId}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Void> createTaskTable(@PathVariable String schemaId) {
        mediator.execute(new CreateTaskTableRequest(schemaId));

        return new ResponseEntity<>(CREATED);
    }

    @PatchMapping("/{id}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> update(@RequestBody Map<String, Object> payload, @PathVariable Long id) {
        SchemaDto tasksSchema = this.schemaService
                .getSchemaByName(TASKS_SCHEMA)
                .orElseThrow(() -> new NotFoundException("Не найдена схема задач: " + TASKS_SCHEMA));

        ResourceQualifier taskQualifier = new ResourceQualifier(TASK_QUALIFIER, id, ResourceType.TASK);
        mediator.execute(new UpdateTaskRequest(new RecordEntity(payload), taskQualifier, tasksSchema));

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/done")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> setStatusToDone(@PathVariable Long id) {
        mediator.execute(new UpdateTaskStatusRequest(DONE, id));

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/in-progress")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> setStatusToProgress(@PathVariable Long id) {
        mediator.execute(new UpdateTaskStatusRequest(IN_PROGRESS, id));

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> setStatusToCancel(@PathVariable Long id) {
        mediator.execute(new UpdateTaskStatusRequest(CANCELED, id));

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/all")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> deleteAllTasks() {
        mediator.execute(new DeleteAllTasksRequest());

        return ResponseEntity.noContent().build();
    }
}
