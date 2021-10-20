package ru.mycrg.data_service.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.service.import_.model.ImportGmlRequestModel;
import ru.mycrg.data_service.service.processes.DefaultProcessHandler;
import ru.mycrg.data_service.service.processes.IProcessHandler;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service.service.processes.dto.ProcessDataModel;
import ru.mycrg.data_service_contract.enums.ProcessType;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static java.util.stream.Collectors.toMap;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

@RestController
@RequestMapping(value = "/processes")
public class ProcessesController {

    private final EntityLinks links;
    private final ProcessService processService;
    private final IProcessHandler defaultProcessHandler;
    private final PagedResourcesAssembler<Process> assembler;
    private final Map<ProcessType, IProcessHandler> processHandlers;

    public ProcessesController(ProcessService processService,
                               PagedResourcesAssembler<Process> assembler,
                               List<IProcessHandler> processHandlers,
                               EntityLinks links,
                               DefaultProcessHandler defaultProcessHandler) {
        this.processService = processService;
        this.assembler = assembler;
        this.links = links;

        this.defaultProcessHandler = defaultProcessHandler;
        this.processHandlers = processHandlers.stream()
                                              .collect(toMap(IProcessHandler::getType, Function.identity()));
    }

    @PostMapping()
    public ResponseEntity<Resource<Process>> initProcess(
            @Valid @RequestBody ProcessDataModel<ImportGmlRequestModel> data) {
        Process process = processHandlers.getOrDefault(ProcessType.valueOf(data.getType()), defaultProcessHandler)
                                         .setPayload(data.getPayload())
                                         .validate()
                                         .handle();

        Resource<Process> resource = new Resource<>(process);
        resource.add(linkTo(ProcessesController.class).slash(process.getId()).withSelfRel());
        resource.add(linkTo(ProcessesController.class).slash(process.getId()).withRel("process"));

        return ResponseEntity.accepted().body(resource);
    }

    @GetMapping()
    public ResponseEntity<Object> getProcesses(Pageable pageable, Principal principal) {
        Page<Process> processes = processService.findAll(pageable, principal);

        Link pageSelfLink = links.linkFor(Process.class).withSelfRel();
        PagedResources<?> pagedResources = assembler.toResource(processes, this::toResource, pageSelfLink);

        return ResponseEntity.ok(pagedResources);
    }

    @GetMapping("/{processId}")
    @PreAuthorize("isAuthenticated()")
    public Resource<Process> getProcessesById(@PathVariable Long processId) {
        Process process = processService.getById(processId);

        Resource<Process> resource = new Resource<>(process);
        resource.add(linkTo(ProcessesController.class).slash(process.getId()).withSelfRel());
        resource.add(linkTo(ProcessesController.class).slash(process.getId()).withRel("process"));

        return resource;
    }

    private ResourceSupport toResource(Process process) {
        Link processLink = links.linkForSingleResource(process).withRel("process");
        Link selfLink = links.linkForSingleResource(process).withSelfRel();

        return new Resource<>(process, processLink, selfLink);
    }
}
