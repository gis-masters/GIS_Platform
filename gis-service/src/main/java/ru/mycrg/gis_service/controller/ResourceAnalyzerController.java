package ru.mycrg.gis_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis_service.service.analyzer.ResourceAnalyzerService;
import ru.mycrg.resource_analyzer_contract.IResourceAnalyzer;
import ru.mycrg.resource_analyzer_contract.IResourceAnalyzerResult;
import ru.mycrg.resource_analyzer_contract.ResourceImpl;

import java.util.List;
import java.util.Map;

import static ru.mycrg.auth_service_contract.Authorities.GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY;

@RestController
@RequestMapping(value = "/resource-analyzers")
public class ResourceAnalyzerController {

    private final ResourceAnalyzerService resourceAnalyzerService;

    public ResourceAnalyzerController(ResourceAnalyzerService resourceAnalyzerService) {
        this.resourceAnalyzerService = resourceAnalyzerService;
    }

    @GetMapping
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Map<String, IResourceAnalyzer>> getAllResourceAnalyzers() {
        return ResponseEntity.ok(resourceAnalyzerService.getResourceAnalyzers());
    }

    @GetMapping("/{analyzerId}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<IResourceAnalyzer> getAnalyzerInfo(@PathVariable String analyzerId) {
        IResourceAnalyzer resourceAnalyzer = resourceAnalyzerService.getById(analyzerId);

        return ResponseEntity.ok(resourceAnalyzer);
    }

    @PostMapping("/{analyzerId}/analyze")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<List<IResourceAnalyzerResult>> getAnalyzerResults(@PathVariable String analyzerId,
                                                                            @RequestBody List<ResourceImpl> resources) {
        List<IResourceAnalyzerResult> analyzeResults = resourceAnalyzerService
                .getById(analyzerId)
                .analyze(resources);

        return ResponseEntity.ok(analyzeResults);
    }
}
