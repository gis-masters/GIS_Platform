package ru.mycrg.gis.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.service.import_.ImportService;
import ru.mycrg.gis.service.import_.WorkImport;

import javax.validation.Valid;
import java.security.Principal;

@RestController
@RequestMapping(value = "/api")
public class ProjectController extends BaseController {

    private final ImportService importService;

    public ProjectController(ImportService importService) {
        this.importService = importService;
    }

    @PostMapping("/{projectId}/import")
    public ResponseEntity<Process> initImport(@PathVariable long projectId,
                                              @Valid @RequestBody WorkImport workImport,
                                              Principal principal) {
        Process process = importService.initProcess(projectId, workImport.getTargetSchema(), workImport, principal);

        return new ResponseEntity<>(process, createHeadersWithLinkToProcess(process), HttpStatus.ACCEPTED);
    }
}
