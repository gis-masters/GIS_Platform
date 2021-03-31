package ru.mycrg.gis_service.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.gis_service.service.analyzer.GisServiceResourceQueryService;
import ru.mycrg.resource_analyzer_contract.IResource;

import static ru.mycrg.auth_service_contract.Authorities.GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY;

@RestController
@RequestMapping(value = "/resources/")
public class ResourcesController {

    private final GisServiceResourceQueryService queryService;
    private final PagedResourcesAssembler<IResource> assembler;

    public ResourcesController(GisServiceResourceQueryService queryService,
                               PagedResourcesAssembler<IResource> assembler) {
        this.queryService = queryService;
        this.assembler = assembler;
    }

    @GetMapping("/{resourceType}/entities")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> getAllResources(@PathVariable String resourceType,
                                                  Pageable pageable) {
        Page<IResource> pagedResources = queryService.getPagedResources(resourceType, pageable);

        return ResponseEntity.ok(assembler.toResource(pagedResources));
    }
}
