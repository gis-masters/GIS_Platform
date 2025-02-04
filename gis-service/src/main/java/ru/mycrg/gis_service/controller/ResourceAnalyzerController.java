package ru.mycrg.gis_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis_service.exceptions.BadRequestException;
import ru.mycrg.gis_service.exceptions.ErrorInfo;
import ru.mycrg.gis_service.exceptions.NotFoundException;
import ru.mycrg.resource_analyzer_contract.IResourceAnalyzer;
import ru.mycrg.resource_analyzer_contract.IResourceAnalyzerResult;
import ru.mycrg.resource_analyzer_contract.IResourceAnalyzerService;
import ru.mycrg.resource_analyzer_contract.impl.Resource;

import java.util.ArrayList;
import java.util.List;

import static ru.mycrg.auth_service_contract.Authorities.SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY;

@RestController
@RequestMapping(value = "/resource-analyzers")
public class ResourceAnalyzerController {

    private final IResourceAnalyzerService resourceAnalyzerService;

    public ResourceAnalyzerController(IResourceAnalyzerService resourceAnalyzerService) {
        this.resourceAnalyzerService = resourceAnalyzerService;
    }

    @GetMapping
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<List<IResourceAnalyzer>> getAllResourceAnalyzers() {
        final List<IResourceAnalyzer> analyzers = new ArrayList<>(resourceAnalyzerService.getAnalyzers().values());

        return ResponseEntity.ok(analyzers);
    }

    @GetMapping("/{analyzerId}")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<IResourceAnalyzer> getAnalyzerInfo(@PathVariable String analyzerId) {
        IResourceAnalyzer resourceAnalyzer = resourceAnalyzerService
                .getById(analyzerId)
                .orElseThrow(() -> new NotFoundException("Не найден анализатор: " + analyzerId));

        return ResponseEntity.ok(resourceAnalyzer);
    }

    @PostMapping("/{analyzerId}/analyze")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<List<IResourceAnalyzerResult>> analyze(@PathVariable String analyzerId,
                                                                 @RequestBody List<Resource> resources) {
        checkForIllegalObjects(resources);

        List<IResourceAnalyzerResult> analyzeResults = resourceAnalyzerService
                .getById(analyzerId)
                .orElseThrow(() -> new NotFoundException("Не найден анализатор: " + analyzerId))
                .analyze(resources);

        return ResponseEntity.ok(analyzeResults);
    }

    private void checkForIllegalObjects(List<Resource> resources) {
        final String NEEDED = "должен быть указан";
        resources.forEach(resource -> {
            if (resource.getId() == null) {
                throw new BadRequestException("Expected objects with id");
            }

            if (resource.getResourceDefinition() == null) {
                throw new BadRequestException("Не указан resourceDefinition",
                                              new ErrorInfo("resourceDefinition", NEEDED));
            }

            if (resource.getResourceDefinition().getType() == null) {
                throw new BadRequestException("Не указан resourceDefinition.type",
                                              new ErrorInfo("resourceDefinition.type", NEEDED));
            }

            if (resource.getResourceDefinition().getTypeTitle() == null) {
                throw new BadRequestException("Не указан resourceDefinition.typeTitle",
                                              new ErrorInfo("resourceDefinition.typeTitle", NEEDED));
            }

            if (resource.getResourceProperties() == null || resource.getResourceProperties().isEmpty()) {
                throw new BadRequestException("Не указан resourceProperties",
                                              new ErrorInfo("resourceProperties", "не может быть пустым"));
            }
        });
    }
}
