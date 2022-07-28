package ru.mycrg.gis_service.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis_service.dto.ProjectProjection;
import ru.mycrg.gis_service.dto.ProjectRequestDto;
import ru.mycrg.gis_service.dto.ProjectUpdateDto;
import ru.mycrg.gis_service.service.ProjectService;

import javax.validation.Valid;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;

@RestController
@RequestMapping(value = "/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final PagedResourcesAssembler<ProjectProjection> assembler;

    public ProjectController(ProjectService projectService,
                             PagedResourcesAssembler<ProjectProjection> assembler) {
        this.assembler = assembler;
        this.projectService = projectService;
    }

    @GetMapping
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> getProjects(@RequestParam(required = false, defaultValue = "") String name,
                                              Pageable pageable) {
        Page<ProjectProjection> projects = projectService.getPaged(name, pageable);

        return ResponseEntity.ok(assembler.toResource(projects));
    }

    @GetMapping("/{id}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public Resource<ProjectProjection> getProjectById(@PathVariable Long id) {
        ProjectProjection project = projectService.getProjectionById(id);

        return new Resource<>(project);
    }

    @PostMapping
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<ProjectProjection> createProject(@Valid @RequestBody ProjectRequestDto projectDto) {
        ProjectProjection project = projectService.create(projectDto);

        return new ResponseEntity<>(project, HttpStatus.CREATED);
    }

    @PatchMapping("/{projectId}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> updateProject(@PathVariable long projectId,
                                                @Valid @RequestBody ProjectUpdateDto projectDto) {
        projectService.update(projectId, projectDto);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{projectId}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> deleteProject(@PathVariable long projectId) {
        projectService.delete(projectId);

        return ResponseEntity.noContent().build();
    }
}
