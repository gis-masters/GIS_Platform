package ru.mycrg.gis.controller;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.gis.dto.ExportRequestModel;
import ru.mycrg.gis.dto.ProjectModel;
import ru.mycrg.gis.dto.ProjectRequestDto;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.service.ProjectService;
import ru.mycrg.gis.service.import_.ImportService;
import ru.mycrg.gis.service.import_.WorkImport;

import javax.validation.Valid;
import java.net.URI;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping(value = "/organizations/{orgId}/projects")
public class ProjectController {

    private static Logger log = LoggerFactory.getLogger(ProjectController.class);

    private final ImportService importService;
    private final ProjectService projectService;

    public ProjectController(ImportService importService,
                             ProjectService projectService) {
        this.importService = importService;
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectModel>> getProjects(@PathVariable Long orgId, Principal principal) {
        log.debug("Request get projects for org: {}", orgId);

        List<ProjectModel> projects = projectService.getProjects(orgId, principal);

        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectModel> getProjectById(@PathVariable Long orgId, @PathVariable Long projectId,
                                                       Principal principal) {
        log.debug("Request get project: {} for org: {}", projectId, orgId);

        return ResponseEntity.ok(projectService.getProject(orgId, projectId, principal));
    }

    @PostMapping
    public ResponseEntity<Process> createProject(@PathVariable Long orgId,
                                                 @Valid @RequestBody ProjectRequestDto projectDto,
                                                 Principal principal) {
        log.debug("Request for createProject for org: {}", orgId);

        Process process = projectService.create(orgId, projectDto, principal);

        return new ResponseEntity<>(process, createHeadersWithLinkToTask(orgId, process), HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Process> deleteProject(@PathVariable long orgId, @PathVariable long projectId,
                                                 Principal principal) {
        log.debug("Request delete project with id: {} for org: {}", projectId, orgId);

        Process process = projectService.delete(orgId, projectId, principal);

        return new ResponseEntity<>(process, createHeadersWithLinkToTask(orgId, process), HttpStatus.ACCEPTED);
    }

    @PostMapping("/{projectId}/import")
    public ResponseEntity<Process> initImport(@PathVariable Long orgId, @PathVariable Long projectId,
                                              @RequestBody WorkImport workImport, Principal principal) {
        log.debug("Request import for org: {} project: {}", orgId, projectId);

        Process process = importService.initProcess(orgId, projectId, workImport, principal);

        URI location = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/{projectId}")
                .buildAndExpand(process.getId())
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(location);

        return new ResponseEntity<>(process, headers, HttpStatus.ACCEPTED);
    }

    @PostMapping("/{projectId}/export")
    public HttpStatus exportProjectLayers(@PathVariable Long orgId, @PathVariable Long projectId,
                                          @Valid @RequestBody ExportRequestModel requestModel, Principal principal) {
        log.debug("Request export layers. For projectId: {} Format: {}", projectId, requestModel.getFormat());

        projectService.export(orgId, projectId, requestModel, principal);

        return HttpStatus.ACCEPTED;
    }


    @NotNull
    private HttpHeaders createHeadersWithLinkToTask(Long orgId, Process process) {
        URI location = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/organizations/{orgId}/tasks/{processId}")
                .buildAndExpand(orgId, process.getId())
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(location);

        return headers;
    }
}
