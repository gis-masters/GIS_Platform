package ru.mycrg.gis.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.gis.entity.Project;
import ru.mycrg.gis.service.ProjectService;
import ru.mycrg.gis.service.import_.ImportService;
import ru.mycrg.gis.service.import_.WorkImport;

import java.net.URI;
import java.security.Principal;
import java.util.Map;
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
    public ResponseEntity<Iterable<Project>> getProjects() {
        Iterable<Project> projects = projectService.getAll();

        return ResponseEntity.ok(projects);
    }

    @PostMapping("/{name}")
    public ResponseEntity createProject(@PathVariable String name, Principal principal) {
        if (principal != null) {
            log.debug("Request for createProject from: {}", principal.getName());
        }

        Project newProject = projectService.create(name);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(newProject.getId())
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(location);

        return new ResponseEntity(headers, HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/{id}")
    public HttpStatus deleteProject(@PathVariable long id) {
        log.debug("Delete project by id: {}", id);

        projectService.delete(id);

        return HttpStatus.NO_CONTENT;
    }

    @PostMapping("/import")
    public CompletableFuture<Map<String, String>> initImport(@RequestBody WorkImport workImport) {
        log.debug("InitImport request");

        return importService.initProcess(workImport);
    }

}
