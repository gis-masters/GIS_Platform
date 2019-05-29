package ru.mycrg.gis.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.gis.entity.Project;
import ru.mycrg.gis.exceptions.CrgNotFoundException;
import ru.mycrg.gis.service.ProjectService;
import ru.mycrg.gis.service.import_.ImportService;
import ru.mycrg.gis.service.import_.WorkImport;

import java.net.URI;
import java.security.Principal;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping(value = "/projects")
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
    public ResponseEntity<List<Project>> getProjects(Principal principal) {
        log.debug("Request get projects for user: {}", principal.getName());

        // List<Project> projects = projectService.getProjectByUser(principal.getName());

        return ResponseEntity.ok(null);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable long id, Principal principal) {
        log.debug("Request get projects for user: {}", principal.getName());

//        Project projectById = projectService.getProjectByUser(principal.getName()).stream()
//                .filter(project -> project.getId() == id)
//                .findFirst()
//                .orElseThrow(() -> new CrgNotFoundException("Не найден проект с id: " + id));

        return ResponseEntity.ok(null);
    }

    @PostMapping("/{name}")
    public ResponseEntity<Project> createProject(@PathVariable String name, Principal principal) {
        if (principal != null) {
            log.debug("Request for createProject from: {}", principal.getName());
        }

        Project newProject = projectService.create(name, principal.getName());

        URI location = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/{id}")
                .buildAndExpand(newProject.getId())
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(location);

        return new ResponseEntity<>(newProject, headers, HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/{id}")
    public HttpStatus deleteProject(@PathVariable long id) {
        log.debug("Delete project by id: {}", id);

        projectService.delete(id);

        return HttpStatus.NO_CONTENT;
    }

    @PostMapping("/import")
    public CompletableFuture<BaseMqProcessResponse> initImport(@RequestBody WorkImport workImport, Principal principal) {
        log.debug("User {} initImport request", principal.getName());

        return importService.initProcess(workImport, principal.getName());
    }

}
