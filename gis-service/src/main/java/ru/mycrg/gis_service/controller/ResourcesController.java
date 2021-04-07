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
import ru.mycrg.common_utils.Paginator;
import ru.mycrg.gis_service.exceptions.NotFoundException;
import ru.mycrg.resource_analyzer_contract.IResource;
import ru.mycrg.resource_analyzer_contract.IResourceQueryService;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static java.util.stream.Collectors.toMap;
import static ru.mycrg.auth_service_contract.Authorities.GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY;

@RestController
@RequestMapping(value = "/resources/")
public class ResourcesController {

    private final PagedResourcesAssembler<IResource> assembler;
    private final Map<String, IResourceQueryService> queryServices;

    public ResourcesController(PagedResourcesAssembler<IResource> assembler,
                               List<IResourceQueryService> queryServices) {

        this.assembler = assembler;
        this.queryServices = queryServices.stream()
                                          .collect(toMap((qs) -> qs.getResourceDefinition().getType(),
                                                         Function.identity()));
    }

    @GetMapping("/{resourceType}/entities")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> getAllResources(@PathVariable String resourceType,
                                                  Pageable pageable) {
        IResourceQueryService resourceQueryService = queryServices.get(resourceType);
        if (resourceQueryService == null) {
            throw new NotFoundException("no such query service");
        }

        List<IResource> resources = resourceQueryService.getResources();
        Page<IResource> page = Paginator.getPage(resources, pageable);

        return ResponseEntity.ok(assembler.toResource(page));
    }
}
