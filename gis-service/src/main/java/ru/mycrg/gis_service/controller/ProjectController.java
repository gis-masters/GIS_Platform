package ru.mycrg.gis_service.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Validator;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.common_contracts.generated.gis_service.project.ProjectCreateDto;
import ru.mycrg.common_contracts.generated.gis_service.project.ProjectUpdateDto;
import ru.mycrg.gis_service.dto.project.ProjectProjection;
import ru.mycrg.gis_service.exceptions.BadRequestException;
import ru.mycrg.gis_service.security.OrgSettingsKeeper;
import ru.mycrg.gis_service.service.ProjectService;
import ru.mycrg.gis_service.validators.project.ProjectCreateValidator;
import ru.mycrg.gis_service.validators.project.ProjectUpdateValidator;

import javax.validation.Valid;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;

@RestController
@RequestMapping(value = "/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final OrgSettingsKeeper orgSettingsKeeper;
    private final Validator projectUpdateValidator;
    private final Validator projectCreateValidator;

    public ProjectController(ProjectService projectService,
                             OrgSettingsKeeper orgSettingsKeeper,
                             ProjectUpdateValidator projectUpdateValidator,
                             ProjectCreateValidator projectCreateValidator) {
        this.orgSettingsKeeper = orgSettingsKeeper;
        this.projectService = projectService;
        this.projectUpdateValidator = projectUpdateValidator;
        this.projectCreateValidator = projectCreateValidator;
    }

    @InitBinder
    protected void initBinder(WebDataBinder binder) {
        if (binder.getTarget() instanceof ProjectCreateDto) {
            binder.addValidators(projectCreateValidator);
        } else if (binder.getTarget() instanceof ProjectUpdateDto) {
            binder.addValidators(projectUpdateValidator);
        }
    }

    @GetMapping
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<?> getProjects(@RequestParam(required = false, defaultValue = "") String name,
                                         @RequestParam(required = false, name = "parent") Long parentFolderId,
                                         Pageable pageable) {
        Page<ProjectProjection> projects = projectService.getPaged(parentFolderId, name, pageable);

        return ResponseEntity.ok(pageFromList(projects, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public Resource<ProjectProjection> getItemById(@PathVariable Long id) {
        ProjectProjection project = projectService.getProjectionById(id);

        return new Resource<>(project);
    }

    @PostMapping
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<ProjectProjection> createItem(@Valid @RequestBody ProjectCreateDto projectDto,
                                                        BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().get(0).getDefaultMessage());
        }

        orgSettingsKeeper.throwIfCreateProjectNotAllowed();

        ProjectProjection project = projectService.create(projectDto);

        return new ResponseEntity<>(project, HttpStatus.CREATED);
    }

    @PatchMapping("/{itemId}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<?> updateItem(@PathVariable long itemId,
                                        @Valid @RequestBody ProjectUpdateDto projectDto,
                                        BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().get(0).getDefaultMessage());
        }

        projectService.update(itemId, projectDto);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{itemId}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<?> deleteItem(@PathVariable long itemId) {
        projectService.delete(itemId);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{movedItemId}/move/{targetFolderId}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<?> moveItem(@PathVariable long movedItemId,
                                      @PathVariable long targetFolderId) {
        projectService.moveProject(movedItemId, targetFolderId);

        return ResponseEntity.ok().build();
    }
}
