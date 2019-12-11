package ru.mycrg.gis.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.service.ProcessService;

import java.security.Principal;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

@RestController
@RequestMapping(value = "/processes")
public class ProcessesController {

    @Autowired
    private ProcessService processService;

    @Autowired
    private PagedResourcesAssembler<Process> assembler;

    @Autowired
    private EntityLinks links;

    @GetMapping()
    public ResponseEntity<?> getProcesses(Pageable pageable, Principal principal) {
        Page<Process> processes = processService.findAll(pageable, principal);

        Link pageSelfLink = links.linkFor(Process.class).withSelfRel();
        PagedResources<?> pagedResources = assembler.toResource(processes, this::toResource, pageSelfLink);

        return ResponseEntity.ok(pagedResources);
    }

    @GetMapping("/{processId}")
    @PreAuthorize("hasPermission('processes', #processId)")
    public Resource<Process> getProcessesById(@PathVariable Long processId) {

        Process process = processService.findById(processId);

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
