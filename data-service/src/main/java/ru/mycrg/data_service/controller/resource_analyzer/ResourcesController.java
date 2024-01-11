package ru.mycrg.data_service.controller.resource_analyzer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.resource_analyzer_contract.IResource;
import ru.mycrg.resource_analyzer_contract.IResourceQueryService;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static java.util.stream.Collectors.toMap;
import static ru.mycrg.auth_service_contract.Authorities.SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;

@RestController
public class ResourcesController {

    private final Map<String, IResourceQueryService> queryServices;

    public ResourcesController(List<IResourceQueryService> queryServices) {
        this.queryServices = queryServices
                .stream()
                .collect(toMap(qs -> qs.getResourceDefinition().getType(), Function.identity()));
    }

    @GetMapping("/resources/{resourceType}/entities")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> getAllResources(@PathVariable String resourceType,
                                                  Pageable pageable) {
        IResourceQueryService resourceQueryService = queryServices.get(resourceType);
        if (resourceQueryService == null) {
            throw new NotFoundException("No such query service " + resourceType);
        }

        Page<IResource> resources = resourceQueryService.getResources(pageable);

        return ResponseEntity.ok(pageFromList(resources, pageable));
    }
}
