package ru.mycrg.data_service.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.service.processes.ProcessHandler;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service.service.processes.ProcessableModel;

import javax.validation.Valid;
import java.security.Principal;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

@RestController
@RequestMapping(value = "/processes")
public class ProcessesController {

    private final EntityLinks links;
    private final ProcessService processService;
    private final ProcessHandler processHandler;
    private final PagedResourcesAssembler<Process> assembler;

    public ProcessesController(ProcessService processService,
                               ProcessHandler processHandler,
                               PagedResourcesAssembler<Process> assembler,
                               EntityLinks links) {
        this.links = links;
        this.assembler = assembler;
        this.processService = processService;
        this.processHandler = processHandler;
    }

    @PostMapping()
    public ResponseEntity<Resource<Process>> initProcess(@Valid @RequestBody ProcessableModel processableModel) {
        Process process = processHandler.handle(processableModel);

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
