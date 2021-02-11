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
import ru.mycrg.gis_service.dto.ProjectProjection;
import ru.mycrg.gis_service.dto.ProjectRequestDto;
import ru.mycrg.gis_service.dto.RelatedLayersModel;
import ru.mycrg.gis_service.exceptions.BadRequestException;
import ru.mycrg.gis_service.exceptions.ErrorInfo;
import ru.mycrg.gis_service.service.LayerService;
import ru.mycrg.gis_service.service.ProjectService;

import javax.validation.Valid;
import java.util.List;

import static ru.mycrg.auth_service_contract.Authorities.GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;

@RestController
@RequestMapping(value = "/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final LayerService layerService;
    private final PagedResourcesAssembler<ProjectProjection> assembler;

    public ProjectController(ProjectService projectService,
                             LayerService layerService,
                             PagedResourcesAssembler<ProjectProjection> assembler) {
        this.assembler = assembler;
        this.layerService = layerService;
        this.projectService = projectService;
    }

    @GetMapping
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> getProjects(@RequestParam(required = false, defaultValue = "") String name,
                                              Pageable pageable,
                                              Authentication authentication) {
        Page<ProjectProjection> projects = projectService.getPaged(name, pageable, authentication);

        return ResponseEntity.ok(assembler.toResource(projects));
    }

    @GetMapping("/{id}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public Resource<ProjectProjection> getProjectById(@PathVariable Long id, Authentication authentication) {
        ProjectProjection project = projectService.getProjectionById(id, authentication);

        return new Resource<>(project);
    }

    @PostMapping
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<ProjectProjection> createProject(@Valid @RequestBody ProjectRequestDto projectDto,
                                                           Authentication authentication) {
        ProjectProjection project = projectService.create(projectDto, authentication);

        return new ResponseEntity<>(project, HttpStatus.CREATED);
    }

    @PutMapping("/{projectId}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> updateProject(@PathVariable long projectId,
                                                @Valid @RequestBody ProjectRequestDto projectDto,
                                                Authentication authentication) {
        projectService.update(projectId, projectDto.getProjectName(), authentication);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{projectId}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> deleteProject(@PathVariable long projectId,
                                                Authentication authentication) {
        projectService.delete(projectId, authentication);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/find-related-layers")
    // Не даём пользователям у которых нет полного доступа к проектам и слоям, т.к. они не могут увидеть полную картину.
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public List<RelatedLayersModel> findRelatedLayers(@RequestParam("field") String field,
                                                      @RequestParam("value") String value,
                                                      Authentication authentication) {
        if (value.isEmpty()) {
            throw new BadRequestException("Required String parameter 'value' is not present",
                                          new ErrorInfo("value", "value parameter is empty"));
        }


        return layerService.findRelatedLayers(field, value, authentication);
    }
}
