package ru.mycrg.gis.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis.dto.ExportRequestModel;
import ru.mycrg.gis.dto.ProjectRequestDto;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.entity.Project;
import ru.mycrg.gis.service.ProjectService;
import ru.mycrg.gis.service.export.ExportService;
import ru.mycrg.gis.service.import_.ImportService;
import ru.mycrg.gis.service.import_.WorkImport;

import javax.validation.Valid;
import java.security.Principal;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static ru.mycrg.gis.security.CrgClaimsParser.getOrganizationId;

@RestController
@RequestMapping(value = "/projects")
public class ProjectController extends BaseController {

    private static Logger log = LoggerFactory.getLogger(ProjectController.class);

    @Autowired
    private PagedResourcesAssembler<Project> assembler;

    @Autowired
    private EntityLinks links;

    private final ImportService importService;
    private final ProjectService projectService;
    private final ExportService exportService;

    public ProjectController(ImportService importService,
                             ExportService exportService,
                             ProjectService projectService) {
        this.importService = importService;
        this.exportService = exportService;
        this.projectService = projectService;
    }

    @GetMapping()
    public ResponseEntity<?> getProjects(Pageable pageable, Principal principal) {
        Page<Project> projects = projectService.findAll(pageable, principal);

        Link pageSelfLink = links.linkFor(Project.class).withSelfRel();
        PagedResources<?> pagedResources = assembler.toResource(projects, this::toResource, pageSelfLink);

        return ResponseEntity.ok(pagedResources);
    }

    @GetMapping("/{projectId}")
    @PreAuthorize("hasPermission('projects', #projectId)")
    public Resource<Project> getProjectById(@PathVariable Long projectId, Principal principal) {
        Project project = projectService.getProject(getOrganizationId(principal), projectId);

        Resource<Project> resource = new Resource<>(project);
        resource.add(linkTo(ProjectController.class).slash(project.getId()).withSelfRel());
        resource.add(linkTo(ProjectController.class).slash(project.getId()).withRel("project"));

        return resource;
    }

    private ResourceSupport toResource(Project project) {
        Link projectLink = links.linkForSingleResource(project).withRel("project");
        Link selfLink = links.linkForSingleResource(project).withSelfRel();

        return new Resource<>(project, projectLink, selfLink);
    }

    @PostMapping
    public ResponseEntity<Process> createProject(@Valid @RequestBody ProjectRequestDto projectDto,
                                                 Principal principal) {
        Process process = projectService.create(projectDto, principal);

        return new ResponseEntity<>(process, createHeadersWithLinkToProcess(process), HttpStatus.ACCEPTED);
    }

    @PutMapping("/{projectId}")
    public HttpStatus updateProject(@PathVariable long projectId,
                                    @Valid @RequestBody ProjectRequestDto projectDto,
                                    Principal principal) {
        projectService.update(projectId, projectDto.getProjectName());

        return HttpStatus.OK;
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Process> deleteProject(@PathVariable long projectId,
                                                 Principal principal) {
        Process process = projectService.delete(projectId, principal);

        return new ResponseEntity<>(process, createHeadersWithLinkToProcess(process), HttpStatus.ACCEPTED);
    }

    @PostMapping("/{projectId}/import")
    public ResponseEntity<Process> initImport(@PathVariable Long projectId,
                                              @RequestBody WorkImport workImport,
                                              Principal principal) {
        Process process = importService.initProcess(projectId, workImport, principal);

        return new ResponseEntity<>(process, createHeadersWithLinkToProcess(process), HttpStatus.ACCEPTED);
    }

    @PostMapping("/{projectId}/export")
    public ResponseEntity<Process> exportProjectLayers(@PathVariable Long projectId,
                                                       @Valid @RequestBody ExportRequestModel requestModel,
                                                       Principal principal) {
        log.debug("Request export layers. For projectId: {} Format: {}", projectId, requestModel.getFormat());

        Process process = exportService.export(projectId, requestModel, principal);

        return new ResponseEntity<>(process, createHeadersWithLinkToProcess(process), HttpStatus.ACCEPTED);
    }

}
