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
import ru.mycrg.gis_service.dto.project.ProjectProjectionImpl;
import ru.mycrg.gis_service.exceptions.BadRequestException;
import ru.mycrg.gis_service.security.OrgSettingsKeeper;
import ru.mycrg.gis_service.service.projects.IProjectMover;
import ru.mycrg.gis_service.service.projects.ProjectFolderMover;
import ru.mycrg.gis_service.service.projects.ProjectMover;
import ru.mycrg.gis_service.service.projects.ProjectService;
import ru.mycrg.gis_service.validators.project.ProjectCreateValidator;
import ru.mycrg.gis_service.validators.project.ProjectUpdateValidator;

import javax.validation.Valid;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;

@RestController
@RequestMapping(value = "/projects")
public class ProjectController {

    private final IProjectMover projectMover;
    private final IProjectMover projectFolderMover;
    private final ProjectService projectService;
    private final Validator projectUpdateValidator;
    private final Validator projectCreateValidator;
    private final OrgSettingsKeeper orgSettingsKeeper;

    public ProjectController(ProjectMover projectMover,
                             ProjectFolderMover projectFolderMover,
                             ProjectService projectService,
                             OrgSettingsKeeper orgSettingsKeeper,
                             ProjectUpdateValidator projectUpdateValidator,
                             ProjectCreateValidator projectCreateValidator) {
        this.projectMover = projectMover;
        this.projectFolderMover = projectFolderMover;
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
        Page<ProjectProjectionImpl> projects = projectService.getPaged(parentFolderId, name, pageable);

        return ResponseEntity.ok(pageFromList(projects, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public Resource<ProjectProjectionImpl> getItemById(@PathVariable Long id) {
        ProjectProjectionImpl project = projectService.getByIdWithRole(id);

        return new Resource<>(project);
    }

    @PostMapping
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<ProjectProjectionImpl> createItem(@Valid @RequestBody ProjectCreateDto projectDto,
                                                            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().get(0).getDefaultMessage());
        }

        orgSettingsKeeper.throwIfCreateProjectNotAllowed();

        ProjectProjectionImpl project = projectService.create(projectDto);

        return new ResponseEntity<>(project, HttpStatus.CREATED);
    }

    @PatchMapping("/{itemId}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<?> updateItem(@PathVariable Long itemId,
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
    public ResponseEntity<?> deleteItem(@PathVariable Long itemId,
                                        @RequestParam(required = false) boolean forced) {
        projectService.delete(itemId, forced);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{movedItemId}/move/{targetFolderId}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<?> moveItem(@PathVariable Long movedItemId,
                                      @PathVariable Long targetFolderId) {
        if (movedItemId.equals(targetFolderId)) {
            return ResponseEntity.ok().build();
        }

        ProjectProjectionImpl movedItem = projectService.getByIdWithRole(movedItemId);
        if (movedItem.isFolder()) {
            projectFolderMover.move(movedItemId, targetFolderId == 0 ? null : targetFolderId);
        } else {
            projectMover.move(movedItemId, targetFolderId == 0 ? null : targetFolderId);
        }

        return ResponseEntity.ok().build();
    }
}
