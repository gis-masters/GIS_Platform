package ru.mycrg.gis_service.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis_service.dto.ProjectRequestDto;
import ru.mycrg.gis_service.dto.ProjectProjection;
import ru.mycrg.gis_service.service.ProjectService;

import javax.validation.Valid;

import static ru.mycrg.gis_service.config.Authorities.GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY;
import static ru.mycrg.gis_service.security.CrgClaimsParser.getOrganizationId;

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
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<?> getProjects(Pageable pageable, Authentication authentication) {
        Page<ProjectProjection> projects = projectService.findAll(pageable, authentication);

        return ResponseEntity.ok(assembler.toResource(projects));
    }

    @GetMapping("/{id}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public Resource<ProjectProjection> getProjectById(@PathVariable Long id, Authentication authentication) {
        ProjectProjection project = projectService.getProjectionById(id, authentication);

        return new Resource<>(project);
    }

    @PostMapping
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<?> createProject(@Valid @RequestBody ProjectRequestDto projectDto,
                                           Authentication authentication) {
        Long organizationId = getOrganizationId(authentication);

        ProjectProjection project = projectService.create(organizationId, projectDto);

        return new ResponseEntity(project, HttpStatus.ACCEPTED);
    }

    @PutMapping("/{projectId}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public HttpStatus updateProject(@PathVariable long projectId,
                                    @Valid @RequestBody ProjectRequestDto projectDto,
                                    Authentication authentication) {
        projectService.update(projectId, projectDto.getProjectName(), authentication);

        return HttpStatus.OK;
    }

    @DeleteMapping("/{projectId}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<?> deleteProject(@PathVariable long projectId,
                                           Authentication authentication) {
        Long organizationId = getOrganizationId(authentication);

        projectService.delete(organizationId, projectId);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
