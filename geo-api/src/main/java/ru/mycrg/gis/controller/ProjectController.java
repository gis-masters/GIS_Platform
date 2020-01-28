package ru.mycrg.gis.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis.dto.ExportRequestModel;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.service.export.ExportService;
import ru.mycrg.gis.service.import_.ImportService;
import ru.mycrg.gis.service.import_.WorkImport;

import javax.validation.Valid;
import java.security.Principal;

@RestController
@RequestMapping(value = "/api")
public class ProjectController extends BaseController {

    private static Logger log = LoggerFactory.getLogger(ProjectController.class);

    private final ImportService importService;
    private final ExportService exportService;

    public ProjectController(ImportService importService,
                             ExportService exportService) {
        this.importService = importService;
        this.exportService = exportService;
    }

    @PostMapping("/{projectName}/import")
    public ResponseEntity<Process> initImport(@PathVariable String projectName,
                                              @Valid @RequestBody WorkImport workImport,
                                              Principal principal) {
        Process process = importService.initProcess(projectName, workImport, principal);

        return new ResponseEntity<>(process, createHeadersWithLinkToProcess(process), HttpStatus.ACCEPTED);
    }

    @PostMapping("/{projectName}/export")
    public ResponseEntity<Process> exportProjectLayers(@PathVariable String projectName,
                                                       @Valid @RequestBody ExportRequestModel requestModel,
                                                       Principal principal) {
        log.debug("Request export layers. For project: {} Format: {}", projectName, requestModel.getFormat());

        Process process = exportService.export(projectName, requestModel, principal);

        return new ResponseEntity<>(process, createHeadersWithLinkToProcess(process), HttpStatus.ACCEPTED);
    }

}
