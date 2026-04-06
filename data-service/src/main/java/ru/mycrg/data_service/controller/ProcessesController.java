package ru.mycrg.data_service.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.dto.ProcessDto;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.processes.ProcessHandler;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.data_service_contract.enums.ProcessType;
import ru.mycrg.http_client.JsonConverter;

import jakarta.validation.Valid;
import java.util.Map;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;

@RestController
@RequestMapping(value = "/processes")
public class ProcessesController {

    private final ProcessService processService;
    private final ProcessHandler processHandler;

    public ProcessesController(ProcessService processService,
                               ProcessHandler processHandler) {
        this.processService = processService;
        this.processHandler = processHandler;
    }

    @PostMapping()
    public ResponseEntity<EntityModel<Process>> initProcess(@Valid @RequestBody ProcessDto processableModel) {
        Process process = processHandler.handle(processableModel);

        return ResponseEntity.accepted().body(toEntityModel(process));
    }

    @PostMapping("/file")
    public ResponseEntity<EntityModel<Process>> initProcessWithFile(@Valid @RequestParam String processModelJson,
                                                                    @RequestParam MultipartFile file) {
        ProcessDto processableModel = JsonConverter.fromJson(processModelJson, ProcessDto.class)
                                                   .orElseThrow(
                                                           () -> new DataServiceException("Некорректное тело запроса"));

        Map<String, Object> payloadWithFile = (Map<String, Object>) processableModel.getPayload();
        payloadWithFile.put("file", file);

        Process process = processHandler.handle(processableModel);

        return ResponseEntity.accepted().body(toEntityModel(process));
    }

    @GetMapping()
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> getProcesses(@RequestParam(required = false) ProcessStatus status,
                                               @RequestParam(required = false) ProcessType type,
                                               @RequestParam(required = false) String title,
                                               Pageable pageable) {
        Page<Process> processes;

        if (status == null && type == null && title == null) {
            processes = processService.findAll(pageable);
        } else {
            processes = processService.findAllByUserWithFilters(status, type, title, pageable);
        }

        return ResponseEntity.ok(pageFromList(processes, pageable));
    }

    @GetMapping("/{processId}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public EntityModel<Process> getProcessesById(@PathVariable Long processId) {
        Process process = processService.getById(processId);

        return toEntityModel(process);
    }

    private EntityModel<Process> toEntityModel(Process process) {
        EntityModel<Process> resource = EntityModel.of(process);
        resource.add(linkTo(ProcessesController.class).slash(process.getId()).withSelfRel());
        resource.add(linkTo(ProcessesController.class).slash(process.getId()).withRel("process"));

        return resource;
    }
}
