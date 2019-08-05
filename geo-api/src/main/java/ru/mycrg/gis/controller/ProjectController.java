package ru.mycrg.gis.controller;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.common.ValidationInfo;
import ru.mycrg.gis.dto.*;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.exceptions.CrgBadRequestException;
import ru.mycrg.gis.service.ProjectService;
import ru.mycrg.gis.service.export.ExportService;
import ru.mycrg.gis.service.import_.ImportService;
import ru.mycrg.gis.service.import_.WorkImport;
import ru.mycrg.gis.service.validation.ValidationService;
import ru.mycrg.gis.service.validation.ViolationService;

import javax.validation.Valid;
import java.net.URI;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping(value = "/organizations/{orgId}/projects")
public class ProjectController extends BaseController {

    private static Logger log = LoggerFactory.getLogger(ProjectController.class);

    private final ImportService importService;
    private final ProjectService projectService;
    private final ExportService exportService;
    private final ValidationService validationService;
    private final ViolationService violationService;

    public ProjectController(ImportService importService,
                             ValidationService validationService,
                             ViolationService violationService,
                             ExportService exportService,
                             ProjectService projectService) {
        this.importService = importService;
        this.exportService = exportService;
        this.projectService = projectService;
        this.validationService = validationService;
        this.violationService = violationService;
    }

    @GetMapping
    @PreAuthorize("hasPermission(#orgId, '')")
    public ResponseEntity<List<ProjectModel>> getProjects(@PathVariable Long orgId) {
        log.debug("Request get projects for org: {}", orgId);

        List<ProjectModel> projects = projectService.getProjects(orgId);

        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{projectId}")
    @PreAuthorize("hasPermission(#orgId, '')")
    public ResponseEntity<ProjectModel> getProjectById(@PathVariable Long orgId,
                                                       @PathVariable Long projectId) {
        log.debug("Request get project: {} for org: {}", projectId, orgId);

        return ResponseEntity.ok(projectService.getProject(orgId, projectId));
    }

    @PostMapping
    @PreAuthorize("hasPermission(#orgId, '')")
    public ResponseEntity<Process> createProject(@PathVariable Long orgId,
                                                 @Valid @RequestBody ProjectRequestDto projectDto,
                                                 Principal principal) {
        log.debug("Request for createProject for org: {}", orgId);

        Process process = projectService.create(orgId, projectDto, principal);

        return new ResponseEntity<>(process, createHeadersWithLinkToTask(orgId, process), HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/{projectId}")
    @PreAuthorize("hasPermission(#orgId, '')")
    public ResponseEntity<Process> deleteProject(@PathVariable long orgId,
                                                 @PathVariable long projectId,
                                                 Principal principal) {
        log.debug("Request delete project with id: {} for org: {}", projectId, orgId);

        Process process = projectService.delete(orgId, projectId, principal);

        return new ResponseEntity<>(process, createHeadersWithLinkToTask(orgId, process), HttpStatus.ACCEPTED);
    }

    @PostMapping("/{projectId}/import")
    @PreAuthorize("hasPermission(#orgId, '')")
    public ResponseEntity<Process> initImport(@PathVariable Long orgId,
                                              @PathVariable Long projectId,
                                              @RequestBody WorkImport workImport,
                                              Principal principal) {
        log.debug("Request import for org: {} project: {}", orgId, projectId);

        Process process = importService.initProcess(orgId, projectId, workImport, principal);

        return new ResponseEntity<>(process, createHeadersWithLinkToTask(orgId, process), HttpStatus.ACCEPTED);
    }

    @PostMapping("/{projectId}/export")
    @PreAuthorize("hasPermission(#orgId, '')")
    public ResponseEntity<Process> exportProjectLayers(@PathVariable Long orgId,
                                                       @PathVariable Long projectId,
                                                       @Valid @RequestBody ExportRequestModel requestModel,
                                                       Principal principal) {
        log.debug("Request export layers. For projectId: {} Format: {}", projectId, requestModel.getFormat());

        Process process = exportService.export(orgId, projectId, requestModel, principal);

        return new ResponseEntity<>(process, createHeadersWithLinkToTask(orgId, process), HttpStatus.ACCEPTED);
    }

    @PostMapping("/{projectId}/validation")
    @PreAuthorize("hasPermission(#orgId, '')")
    public ResponseEntity<Process> initValidation(@PathVariable Long orgId,
                                                  @PathVariable Long projectId,
                                                  @Valid @RequestBody ValidationRequestDto request,
                                                  Principal principal) {
        log.debug("Init validation for: {} resources", request.getLayers().size());

        Process process = validationService.validate(orgId, projectId, principal, request);

        return new ResponseEntity<>(process, createHeadersWithLinkToTask(orgId, process), HttpStatus.ACCEPTED);
    }

    @GetMapping("/{projectId}/validation")
    @PreAuthorize("hasPermission(#orgId, '')")
    public ResponseEntity<ValidationResponseDto> getValidationResults(
            @PathVariable Long orgId,
            @PathVariable Long projectId,
            @RequestParam String layerName,
            @RequestParam(required = false, name = "page", defaultValue = "0") String page,
            @RequestParam(required = false, name = "size", defaultValue = "25") String size,
            Principal principal) {
        log.info("Request get validation results for layer: {} - {}/{}", layerName, page, size);

        int nPage;
        int nSize;
        try {
            nPage = Integer.parseInt(page);
            nSize = Integer.parseInt(size);
        } catch (NumberFormatException e) {
            throw new CrgBadRequestException(e.getLocalizedMessage());
        }

        ValidationResponseDto result = violationService.getViolations(orgId, projectId, layerName, nPage, nSize);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/{projectId}/validation/short")
    @PreAuthorize("hasPermission(#orgId, '')")
    public ResponseEntity<List<ValidationInfo>> getValidationInfo(@PathVariable Long orgId,
                                                                  @PathVariable Long projectId,
                                                                  @Valid @RequestBody ValidationRequestDto request) {
        log.debug("Request get short validation info");

        List<ValidationInfo> result = violationService.getShortInfo(orgId, projectId, request);

        return ResponseEntity.ok(result);
    }

}
