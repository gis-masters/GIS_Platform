package ru.mycrg.integration_service.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.integration_service.dto.ResourceAnalyzeModel;
import ru.mycrg.integration_service.service.ResourceAnalyzerService;

import java.util.List;
import java.util.Set;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;

@RestController
@RequestMapping(value = "/resource-analyzers")
public class AnalyzersController {

    private final ResourceAnalyzerService resourceAnalyzerService;

    public AnalyzersController(ResourceAnalyzerService resourceAnalyzerService) {
        this.resourceAnalyzerService = resourceAnalyzerService;
    }

    @GetMapping
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<List<ResourceAnalyzeModel>> getDefinitions() {
        return ResponseEntity.ok(resourceAnalyzerService.getAllAnalyzers());
    }

    @PostMapping
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<String> analyze(
            @RequestParam(name = "resourceType", required = false) String resourceType,
            @RequestParam(name = "analyzerIds", required = false) Set<String> analyzerIds) {
        final String processId = resourceAnalyzerService.analyze(resourceType, analyzerIds);

        return ResponseEntity.accepted()
                             .body(processId);
    }
}
