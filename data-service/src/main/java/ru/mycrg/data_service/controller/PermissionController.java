package ru.mycrg.data_service.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.dto.ResourceProjection;
import ru.mycrg.data_service.service.resources.ResourcesService;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static ru.mycrg.auth_service_contract.Authorities.GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY;

@RestController
public class PermissionController {

    private final ResourcesService resourcesService;

    public PermissionController(ResourcesService resourcesService) {
        this.resourcesService = resourcesService;
    }

    @GetMapping("/all-permissions")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> getAllPermissions(Pageable pageable,
                                                    PagedResourcesAssembler<ResourceProjection> pageAssembler) {
        final Page<ResourceProjection> result = resourcesService.getPaged(pageable);

        var pagedResources = pageAssembler.toResource(
                result,
                linkTo(PermissionController.class)
                        .slash("/api/data/all-permissions")
                        .withSelfRel());

        return ResponseEntity.ok(pagedResources);
    }
}
