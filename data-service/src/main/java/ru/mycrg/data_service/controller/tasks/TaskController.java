package ru.mycrg.data_service.controller.tasks;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.entity.Task;
import ru.mycrg.data_service.service.TaskService;
import ru.mycrg.data_service.service.cqrs.tasks.requests.CreateTaskRequest;
import ru.mycrg.data_service.service.cqrs.tasks.requests.UpdateTaskRequest;
import ru.mycrg.data_service.service.cqrs.tasks.requests.UpdateTaskStatusRequest;
import ru.mycrg.data_service_contract.dto.TaskCreateDto;
import ru.mycrg.data_service_contract.dto.TaskUpdateDto;
import ru.mycrg.mediator.Mediator;

import javax.validation.Valid;

import static org.springframework.http.HttpStatus.CREATED;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;
import static ru.mycrg.data_service.util.StringUtil.camelCaseToSnakeCaseForEcqlFilter;
import static ru.mycrg.data_service_contract.enums.TaskStatus.*;

@RestController
@RequestMapping(value = "/tasks")
public class TaskController {

    private final Mediator mediator;
    private final TaskService taskService;

    public TaskController(Mediator mediator, TaskService taskService) {
        this.mediator = mediator;
        this.taskService = taskService;
    }

    @GetMapping
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> getAll(
            @RequestParam(name = "filter", required = false, defaultValue = "") String ecqlFilter,
            Pageable pageable) {
        Page<Task> tasks = taskService.getAll(camelCaseToSnakeCaseForEcqlFilter(ecqlFilter), pageable);

        return ResponseEntity.ok(pageFromList(tasks, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Task> getById(@PathVariable Long id) {
        Task task = taskService.getById(id);

        return ResponseEntity.ok(task);
    }

    @PostMapping
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> create(@Valid @RequestBody TaskCreateDto taskCreateDto) {
        Task createdTask = mediator.execute(new CreateTaskRequest(taskCreateDto));

        return new ResponseEntity<>(createdTask, CREATED);
    }

    @PatchMapping("/{id}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> update(@Valid @RequestBody TaskUpdateDto taskUpdateDto, @PathVariable Long id) {
        mediator.execute(new UpdateTaskRequest(taskUpdateDto, id));

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
}
