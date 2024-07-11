package ru.mycrg.gis_service.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis_service.dto.project.ProjectCreateDto;
import ru.mycrg.gis_service.dto.project.ProjectProjection;
import ru.mycrg.gis_service.dto.project.ProjectUpdateDto;
import ru.mycrg.gis_service.exceptions.BadRequestException;
import ru.mycrg.gis_service.security.OrgSettingsKeeper;
import ru.mycrg.gis_service.service.ProjectService;

import javax.validation.Valid;
import java.io.IOException;
import java.util.List;

import static java.util.Objects.nonNull;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;
import static ru.mycrg.gis_service.GisServiceApplication.objectMapper;

@RestController
@RequestMapping(value = "/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final OrgSettingsKeeper orgSettingsKeeper;

    public ProjectController(ProjectService projectService,
                             OrgSettingsKeeper orgSettingsKeeper) {
        this.orgSettingsKeeper = orgSettingsKeeper;
        this.projectService = projectService;
    }

    @GetMapping
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> getProjects(@RequestParam(required = false, defaultValue = "") String name,
                                              Pageable pageable) {
        Page<ProjectProjection> projects = projectService.getPaged(name, pageable);

        return ResponseEntity.ok(pageFromList(projects, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public Resource<ProjectProjection> getProjectById(@PathVariable Long id) {
        ProjectProjection project = projectService.getProjectionById(id);

        return new Resource<>(project);
    }

    @PostMapping
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<ProjectProjection> createProject(@Valid @RequestBody ProjectCreateDto projectDto) {
        orgSettingsKeeper.throwIfCreateProjectNotAllowed();
        throwsIfBboxIsNotValid(projectDto.getBbox());

        ProjectProjection project = projectService.create(projectDto);

        return new ResponseEntity<>(project, HttpStatus.CREATED);
    }

    @PatchMapping("/{projectId}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> updateProject(@PathVariable long projectId,
                                                @Valid @RequestBody ProjectUpdateDto projectDto) {
        throwsIfBboxIsNotValid(projectDto.getBbox());

        projectService.update(projectId, projectDto);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{projectId}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> deleteProject(@PathVariable long projectId) {
        projectService.delete(projectId);

        return ResponseEntity.noContent().build();
    }

    private void throwsIfBboxIsNotValid(String bbox) {
        if (!nonNull(bbox) || bbox.isEmpty()) {
            return;
        }

        try {
            TypeReference<List<Double>> type = new TypeReference<>() {
            };
            List<Double> coordinates = objectMapper.readValue(bbox, type);
            if (!coordinates.isEmpty() && coordinates.size() != 4) {
                throw new BadRequestException("Невалидный bbox! Поле bbox должно состоять из 4 чисел.");
            }
        } catch (IOException e) {
            throw new BadRequestException("Невалидный bbox! Поле bbox должно состоять из 4 чисел.");
        }
    }
}
