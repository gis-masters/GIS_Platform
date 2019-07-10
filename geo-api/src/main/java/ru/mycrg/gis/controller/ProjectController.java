package ru.mycrg.gis.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.common.BaseMqProcessResponse;
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
import java.util.concurrent.CompletableFuture;

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
    public ResponseEntity<List<ProjectModel>> getProjects(@PathVariable Long orgId) {
        log.debug("Request get projects for org: {}", orgId);

        List<ProjectModel> projects = projectService.getProjects(orgId);

        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectModel> getProjectById(@PathVariable Long orgId, @PathVariable Long projectId) {
        log.debug("Request get project: {} for org: {}", projectId, orgId);

        return ResponseEntity.ok(projectService.getProject(orgId, projectId));
    }

    @PostMapping
    public ResponseEntity<ProjectModel> createProject(@PathVariable Long orgId,
                                                      @Valid @RequestBody ProjectRequestDto projectDto) {
        log.debug("Request for createProject for org: {}", orgId);

        ProjectModel newProject = projectService.create(orgId, projectDto);

        URI location = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/{projectId}")
                .buildAndExpand(newProject.getId())
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(location);

        return new ResponseEntity<>(newProject, headers, HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/{projectId}")
    public HttpStatus deleteProject(@PathVariable long orgId, @PathVariable long projectId) {
        log.debug("Request delete project with id: {} for org: {}", projectId, orgId);

        projectService.delete(orgId, projectId);

        return HttpStatus.NO_CONTENT;
    }

    @PostMapping("/{projectId}/import")
    public ResponseEntity<Process> initImport(@PathVariable Long orgId, @PathVariable Long projectId,
                                              @RequestBody WorkImport workImport) {
        log.debug("Request import for org: {} project: {}", orgId, projectId);

        Process newProcess = importService.initProcess(orgId, projectId, workImport);

        URI location = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/{projectId}")
                .buildAndExpand(newProcess.getId())
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(location);

        return new ResponseEntity<>(newProcess, headers, HttpStatus.ACCEPTED);
    }

    @PostMapping("/{projectId}/export")
    public HttpStatus exportProjectLayers(@PathVariable Long orgId, @PathVariable Long projectId,
                                          @Valid @RequestBody ExportRequestModel requestModel) {
        log.debug("Request export layers. For projectId: {} Format: {}", projectId, requestModel.getFormat());

        projectService.export(orgId, projectId, requestModel);

        return HttpStatus.ACCEPTED;
    }

}
