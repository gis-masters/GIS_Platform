package ru.mycrg.data_service.controller.tasks;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.entity.TaskLog;
import ru.mycrg.data_service.service.TaskLogService;

import java.util.List;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;
import static ru.mycrg.data_service.util.StringUtil.camelCaseToSnakeCaseForEcqlFilter;

@RestController
@RequestMapping(value = "/task-log")
public class TaskLogController {

    private final TaskLogService taskLogService;

    public TaskLogController(TaskLogService taskLogService) {
        this.taskLogService = taskLogService;
    }

    @GetMapping
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> getTasksLog(@RequestParam(name = "filter", required = false) String ecqlFilter,
                                              Pageable pageable) {
        Page<TaskLog> tasks = taskLogService.findAll(camelCaseToSnakeCaseForEcqlFilter(ecqlFilter), pageable);

        return ResponseEntity.ok(pageFromList(tasks, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> getLogByTaskId(@PathVariable Long id) {
        List<TaskLog> logsByTask = taskLogService.getByTaskId(id);

        return ResponseEntity.ok(logsByTask);
    }
}
